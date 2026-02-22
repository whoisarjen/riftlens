import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { matches, matchParticipants } from "@/lib/db/schema";
import { getMatch, getMatchTimeline } from "@/lib/riot/match";
import { upsertMatch } from "@/lib/db/queries/match";
import { getLatestVersion } from "@/lib/riot/ddragon";
import type {
  MatchDetail,
  ParticipantDetail,
  TeamDetail,
  TimelineData,
  TimelineFrameData,
  TimelineEventData,
} from "@/lib/types/internal";
import type { MatchDTO, MatchTimelineDTO, TeamDTO } from "@/lib/types/riot";
import { MatchHeader } from "@/components/match/match-header";
import { MatchScoreboard } from "@/components/match/match-scoreboard";
import { MatchCharts } from "@/components/match/match-charts";

interface MatchPageProps {
  params: Promise<{ matchId: string }>;
  searchParams: Promise<{ puuid?: string }>;
}

function regionFromMatchId(matchId: string): string {
  const prefix = matchId.split("_")[0].toLowerCase();
  const mapping: Record<string, string> = {
    na1: "na1",
    euw1: "euw1",
    eun1: "eun1",
    kr: "kr",
    br1: "br1",
    jp1: "jp1",
    la1: "la1",
    la2: "la2",
    oc1: "oc1",
    tr1: "tr1",
    ru: "ru",
    ph2: "ph2",
    sg2: "sg2",
    th2: "th2",
    tw2: "tw2",
    vn2: "vn2",
  };
  return mapping[prefix] || "na1";
}

function transformTimeline(raw: MatchTimelineDTO): TimelineData {
  const frames: TimelineFrameData[] = raw.info.frames.map((frame) => {
    let blueTeamGold = 0;
    let redTeamGold = 0;
    let blueTeamXp = 0;
    let redTeamXp = 0;
    const participants: Record<
      number,
      { gold: number; xp: number; cs: number; level: number }
    > = {};

    for (const [, pf] of Object.entries(frame.participantFrames)) {
      const pid = pf.participantId;
      participants[pid] = {
        gold: pf.totalGold,
        xp: pf.xp,
        cs: pf.minionsKilled + pf.jungleMinionsKilled,
        level: pf.level,
      };
      if (pid <= 5) {
        blueTeamGold += pf.totalGold;
        blueTeamXp += pf.xp;
      } else {
        redTeamGold += pf.totalGold;
        redTeamXp += pf.xp;
      }
    }

    const events: TimelineEventData[] = frame.events
      .filter((e) =>
        [
          "CHAMPION_KILL",
          "ELITE_MONSTER_KILL",
          "BUILDING_KILL",
          "WARD_PLACED",
          "WARD_KILL",
        ].includes(e.type)
      )
      .map((e) => ({
        type: e.type,
        timestamp: e.timestamp,
        killerId: e.killerId,
        victimId: e.victimId,
        position: e.position,
        wardType: e.wardType,
        monsterType: e.monsterType,
        buildingType: e.buildingType,
        teamId: e.teamId,
      }));

    return {
      timestamp: frame.timestamp,
      blueTeamGold,
      redTeamGold,
      blueTeamXp,
      redTeamXp,
      participants,
      events,
    };
  });

  return { frames };
}

function transformMatch(
  matchData: MatchDTO,
  timeline: TimelineData | null
): MatchDetail {
  const info = matchData.info;
  const meta = matchData.metadata;

  const teams: TeamDetail[] = info.teams.map((t: TeamDTO) => {
    const teamParticipants = info.participants.filter(
      (p) => p.teamId === t.teamId
    );
    return {
      teamId: t.teamId,
      win: t.win,
      totalKills: teamParticipants.reduce((sum, p) => sum + p.kills, 0),
      totalGold: teamParticipants.reduce((sum, p) => sum + p.goldEarned, 0),
      dragons: t.objectives?.dragon?.kills ?? 0,
      barons: t.objectives?.baron?.kills ?? 0,
      towers: t.objectives?.tower?.kills ?? 0,
      inhibitors: t.objectives?.inhibitor?.kills ?? 0,
      bans: t.bans ?? [],
    };
  });

  const participants: ParticipantDetail[] = info.participants.map((p) => ({
    puuid: p.puuid,
    participantId: p.participantId,
    riotIdGameName: p.riotIdGameName ?? "",
    riotIdTagline: p.riotIdTagline ?? "",
    teamId: p.teamId,
    championId: p.championId,
    championName: p.championName,
    champLevel: p.champLevel,
    win: p.win,
    kills: p.kills,
    deaths: p.deaths,
    assists: p.assists,
    cs: p.totalMinionsKilled + (p.neutralMinionsKilled ?? 0),
    visionScore: p.visionScore,
    wardsPlaced: p.wardsPlaced,
    wardsKilled: p.wardsKilled,
    goldEarned: p.goldEarned,
    totalDamage: p.totalDamageDealtToChampions,
    physicalDamage: p.physicalDamageDealtToChampions,
    magicDamage: p.magicDamageDealtToChampions,
    trueDamage: p.trueDamageDealtToChampions,
    damageTaken: p.totalDamageTaken,
    items: [p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6],
    summoner1Id: p.summoner1Id,
    summoner2Id: p.summoner2Id,
    primaryRuneStyle: p.perks?.styles?.[0]?.style ?? 0,
    primaryRune: p.perks?.styles?.[0]?.selections?.[0]?.perk ?? 0,
    secondaryRuneStyle: p.perks?.styles?.[1]?.style ?? 0,
    role: p.teamPosition || p.lane || "",
  }));

  return {
    matchId: meta.matchId,
    queueId: info.queueId,
    gameMode: info.gameMode,
    gameDuration: info.gameDuration,
    gameVersion: info.gameVersion,
    gameStartTimestamp: info.gameStartTimestamp,
    teams,
    participants,
    timeline,
  };
}

function transformFromDb(
  matchRow: typeof matches.$inferSelect,
  participantRows: (typeof matchParticipants.$inferSelect)[]
): MatchDetail {
  const blueParticipants = participantRows.filter((p) => p.teamId === 100);
  const redParticipants = participantRows.filter((p) => p.teamId === 200);

  const makeTeam = (
    teamId: number,
    teamParticipants: typeof participantRows
  ): TeamDetail => {
    const firstParticipant = teamParticipants[0];
    return {
      teamId,
      win: firstParticipant?.win ?? false,
      totalKills: teamParticipants.reduce((sum, p) => sum + p.kills, 0),
      totalGold: teamParticipants.reduce((sum, p) => sum + p.goldEarned, 0),
      dragons: 0,
      barons: 0,
      towers: 0,
      inhibitors: 0,
      bans: [],
    };
  };

  const teams: TeamDetail[] = [
    makeTeam(100, blueParticipants),
    makeTeam(200, redParticipants),
  ];

  const participants: ParticipantDetail[] = participantRows.map((p) => ({
    puuid: p.puuid,
    participantId: p.participantId,
    riotIdGameName: p.riotIdGameName ?? "",
    riotIdTagline: p.riotIdTagline ?? "",
    teamId: p.teamId,
    championId: p.championId,
    championName: p.championName,
    champLevel: p.champLevel,
    win: p.win,
    kills: p.kills,
    deaths: p.deaths,
    assists: p.assists,
    cs: p.totalMinionsKilled,
    visionScore: p.visionScore,
    wardsPlaced: p.wardsPlaced,
    wardsKilled: p.wardsKilled,
    goldEarned: p.goldEarned,
    totalDamage: p.totalDamageDealt,
    physicalDamage: p.physicalDamage,
    magicDamage: p.magicDamage,
    trueDamage: p.trueDamage,
    damageTaken: p.damageTaken,
    items: [
      p.item0 ?? 0,
      p.item1 ?? 0,
      p.item2 ?? 0,
      p.item3 ?? 0,
      p.item4 ?? 0,
      p.item5 ?? 0,
      p.item6 ?? 0,
    ],
    summoner1Id: p.summoner1Id ?? 0,
    summoner2Id: p.summoner2Id ?? 0,
    primaryRuneStyle: p.primaryRuneStyle ?? 0,
    primaryRune: p.primaryRune0 ?? 0,
    secondaryRuneStyle: p.secondaryRuneStyle ?? 0,
    role: p.role ?? "",
  }));

  const timeline = matchRow.timelineData
    ? (matchRow.timelineData as TimelineData)
    : null;

  return {
    matchId: matchRow.matchId,
    queueId: matchRow.queueId,
    gameMode: matchRow.gameMode,
    gameDuration: matchRow.gameDuration,
    gameVersion: matchRow.gameVersion,
    gameStartTimestamp: matchRow.gameStartTs,
    teams,
    participants,
    timeline,
  };
}

async function fetchMatchDetail(matchId: string): Promise<MatchDetail | null> {
  const region = regionFromMatchId(matchId);

  // 1. Try loading from DB
  const matchRows = await db
    .select()
    .from(matches)
    .where(eq(matches.matchId, matchId))
    .limit(1);

  if (matchRows.length > 0) {
    const participantRows = await db
      .select()
      .from(matchParticipants)
      .where(eq(matchParticipants.matchId, matchId));

    return transformFromDb(matchRows[0], participantRows);
  }

  // 2. Not in DB — fetch from Riot API
  try {
    const matchData = await getMatch(region, matchId);

    let timeline: TimelineData | null = null;
    try {
      const rawTimeline = await getMatchTimeline(region, matchId);
      timeline = transformTimeline(rawTimeline);
    } catch {
      // Timeline is optional
    }

    // Cache in DB
    try {
      await upsertMatch(matchData, region);
      if (timeline) {
        await db
          .update(matches)
          .set({ timelineData: timeline })
          .where(eq(matches.matchId, matchId));
      }
    } catch {
      // Caching failure is non-fatal
    }

    return transformMatch(matchData, timeline);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { matchId } = await params;
  return {
    title: `Match ${matchId} | Riftlens`,
  };
}

export default async function MatchDetailPage({
  params,
  searchParams,
}: MatchPageProps) {
  const { matchId } = await params;
  const { puuid } = await searchParams;
  const match = await fetchMatchDetail(matchId);

  if (!match) {
    notFound();
  }

  const version = await getLatestVersion();

  return (
    <div className="space-y-6">
      <MatchHeader match={match} version={version} />
      <MatchScoreboard
        match={match}
        version={version}
        highlightPuuid={puuid}
      />
      <MatchCharts match={match} version={version} />
    </div>
  );
}
