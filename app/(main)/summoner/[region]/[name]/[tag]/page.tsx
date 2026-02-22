import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SummonerHeader } from "@/components/summoner/summoner-header";
import { RankedInfo } from "@/components/summoner/ranked-info";
import { MatchHistory } from "@/components/summoner/match-history";
import { getLatestVersion } from "@/lib/riot/ddragon";
import { getAccountByRiotId } from "@/lib/riot/account";
import { getSummonerByPuuid, getLeagueEntries } from "@/lib/riot/summoner";
import { getMatchIds, getMatch } from "@/lib/riot/match";
import { getCachedSummoner, upsertSummoner } from "@/lib/db/queries/summoner";
import {
  isMatchCached,
  upsertMatch,
  getCachedMatches,
  getMatchParticipants,
} from "@/lib/db/queries/match";
import type {
  SummonerProfile,
  RankedInfo as RankedInfoType,
  MatchSummary,
  MatchParticipantSummary,
} from "@/lib/types/internal";
import type { LeagueEntryDTO } from "@/lib/types/riot";
import type { RegionId } from "@/lib/constants";

interface PageProps {
  params: Promise<{
    region: string;
    name: string;
    tag: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { region, name, tag } = await params;
  const decodedName = decodeURIComponent(name);
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedName}#${decodedTag} (${region.toUpperCase()})`,
    description: `Player profile and match history for ${decodedName}#${decodedTag} on ${region.toUpperCase()} — Riftlens`,
  };
}

/**
 * Fetch summoner profile: check DB cache first, then fall back to Riot API.
 */
async function fetchSummonerProfile(
  region: string,
  gameName: string,
  tagLine: string
): Promise<SummonerProfile | null> {
  try {
    // 1. Check DB cache
    const cached = await getCachedSummoner(region, gameName, tagLine);
    if (cached) return cached;

    // 2. Fetch fresh data from Riot API
    const account = await getAccountByRiotId(region, gameName, tagLine);
    const summoner = await getSummonerByPuuid(region, account.puuid);

    // 3. Fetch ranked info (graceful degradation if unavailable)
    let leagueEntries: LeagueEntryDTO[] = [];
    if (summoner.id) {
      try {
        leagueEntries = await getLeagueEntries(region, summoner.id);
      } catch (err) {
        console.warn("Failed to fetch league entries:", err);
      }
    }

    const soloEntry = leagueEntries.find(
      (e: LeagueEntryDTO) => e.queueType === "RANKED_SOLO_5x5"
    );
    const flexEntry = leagueEntries.find(
      (e: LeagueEntryDTO) => e.queueType === "RANKED_FLEX_SR"
    );

    const soloRank: RankedInfoType | null = soloEntry
      ? {
          tier: soloEntry.tier,
          rank: soloEntry.rank,
          lp: soloEntry.leaguePoints,
          wins: soloEntry.wins,
          losses: soloEntry.losses,
        }
      : null;

    const flexRank: RankedInfoType | null = flexEntry
      ? {
          tier: flexEntry.tier,
          rank: flexEntry.rank,
          lp: flexEntry.leaguePoints,
          wins: flexEntry.wins,
          losses: flexEntry.losses,
        }
      : null;

    // 4. Build profile
    const profile: SummonerProfile = {
      puuid: account.puuid,
      gameName: account.gameName,
      tagLine: account.tagLine,
      region: region as RegionId,
      summonerId: summoner.id ?? null,
      profileIconId: summoner.profileIconId,
      summonerLevel: summoner.summonerLevel,
      soloRank,
      flexRank,
    };

    // 5. Cache in DB (fire-and-forget)
    await upsertSummoner(profile).catch((err) =>
      console.error("Failed to cache summoner:", err)
    );

    return profile;
  } catch (err) {
    console.error("Summoner lookup error:", err);
    return null;
  }
}

/**
 * Fetch match history: get IDs from Riot, backfill DB, then read from DB.
 */
async function fetchMatches(
  region: string,
  puuid: string,
  count: number = 20
): Promise<MatchSummary[]> {
  try {
    // 1. Get recent match IDs from Riot
    const matchIds = await getMatchIds(region, puuid, count);

    // 2. For each match not in DB, fetch and insert
    for (const matchId of matchIds) {
      const cached = await isMatchCached(matchId);
      if (!cached) {
        try {
          const matchData = await getMatch(region, matchId);
          await upsertMatch(matchData, region);
        } catch (err) {
          console.error(`Failed to fetch/cache match ${matchId}:`, err);
        }
      }
    }

    // 3. Fetch cached matches from DB
    const cachedRows = await getCachedMatches(puuid, count);

    // 4. Group by matchId
    const matchGroups = new Map<string, typeof cachedRows>();
    for (const row of cachedRows) {
      if (!matchGroups.has(row.matchId)) {
        matchGroups.set(row.matchId, []);
      }
      matchGroups.get(row.matchId)!.push(row);
    }

    // 5. Build MatchSummary[]
    const summaries: MatchSummary[] = [];

    for (const [matchId, rows] of matchGroups) {
      const playerRow = rows[0];
      const allParticipants = await getMatchParticipants(matchId);

      const participantSummaries: MatchParticipantSummary[] =
        allParticipants.map((p) => ({
          puuid: p.puuid,
          championId: p.championId,
          championName: p.championName,
          teamId: p.teamId,
          riotIdGameName: p.riotIdGameName ?? "",
          riotIdTagline: p.riotIdTagline ?? "",
        }));

      summaries.push({
        matchId: playerRow.matchId,
        queueId: playerRow.queueId,
        gameMode: playerRow.gameMode,
        gameDuration: playerRow.gameDuration,
        gameStartTimestamp: playerRow.gameStartTs,
        championId: playerRow.championId,
        championName: playerRow.championName,
        win: playerRow.win,
        kills: playerRow.kills,
        deaths: playerRow.deaths,
        assists: playerRow.assists,
        cs: playerRow.totalMinionsKilled,
        visionScore: playerRow.visionScore,
        goldEarned: playerRow.goldEarned,
        items: [
          playerRow.item0 ?? 0,
          playerRow.item1 ?? 0,
          playerRow.item2 ?? 0,
          playerRow.item3 ?? 0,
          playerRow.item4 ?? 0,
          playerRow.item5 ?? 0,
          playerRow.item6 ?? 0,
        ],
        summoner1Id: playerRow.summoner1Id ?? 0,
        summoner2Id: playerRow.summoner2Id ?? 0,
        primaryRuneStyle: playerRow.primaryRuneStyle ?? 0,
        primaryRune: playerRow.primaryRune0 ?? 0,
        role: playerRow.role ?? "",
        participants: participantSummaries,
      });
    }

    return summaries;
  } catch (err) {
    console.error("Match history error:", err);
    return [];
  }
}

export default async function SummonerPage({ params }: PageProps) {
  const { region, name, tag } = await params;
  const decodedName = decodeURIComponent(name);
  const decodedTag = decodeURIComponent(tag);

  const [profile, version] = await Promise.all([
    fetchSummonerProfile(region, decodedName, decodedTag),
    getLatestVersion(),
  ]);

  if (!profile) {
    notFound();
  }

  const matches = await fetchMatches(region, profile.puuid);

  return (
    <div className="flex flex-col gap-6">
      {/* Player header */}
      <SummonerHeader profile={profile} version={version} />

      {/* Ranked info */}
      <RankedInfo soloRank={profile.soloRank} flexRank={profile.flexRank} />

      {/* Match history */}
      <MatchHistory matches={matches} version={version} />
    </div>
  );
}
