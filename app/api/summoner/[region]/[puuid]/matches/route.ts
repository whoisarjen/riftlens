import { NextResponse } from "next/server";
import { getMatchIds, getMatch } from "@/lib/riot/match";
import {
  isMatchCached,
  upsertMatch,
  getCachedMatches,
  getMatchParticipants,
} from "@/lib/db/queries/match";
import { RiotApiError } from "@/lib/riot/client";
import type { MatchSummary, MatchParticipantSummary } from "@/lib/types/internal";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ region: string; puuid: string }> }
) {
  try {
    const { region, puuid } = await params;

    // Read optional count query param
    const { searchParams } = new URL(request.url);
    const count = Math.min(
      Math.max(parseInt(searchParams.get("count") ?? "20", 10) || 20, 1),
      100
    );

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
          // Log but continue -- a single match failure should not block the rest
          console.error(`Failed to fetch/cache match ${matchId}:`, err);
        }
      }
    }

    // 3. Fetch cached matches from DB
    const cachedRows = await getCachedMatches(puuid, count);

    // 4. Group by matchId to build MatchSummary[]
    const matchGroups = new Map<string, typeof cachedRows>();
    for (const row of cachedRows) {
      if (!matchGroups.has(row.matchId)) {
        matchGroups.set(row.matchId, []);
      }
      matchGroups.get(row.matchId)!.push(row);
    }

    // 5. For each match, fetch all participants and build MatchSummary
    const summaries: MatchSummary[] = [];

    for (const [matchId, rows] of matchGroups) {
      // The current player's row
      const playerRow = rows[0]; // Only one row per match for this puuid

      // Fetch all participants for this match to populate the participants array
      const allParticipants = await getMatchParticipants(matchId);

      const participantSummaries: MatchParticipantSummary[] = allParticipants.map(
        (p) => ({
          puuid: p.puuid,
          championId: p.championId,
          championName: p.championName,
          teamId: p.teamId,
          riotIdGameName: p.riotIdGameName ?? "",
          riotIdTagline: p.riotIdTagline ?? "",
        })
      );

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

    return NextResponse.json(summaries);
  } catch (error) {
    if (error instanceof RiotApiError) {
      if (error.status === 404) {
        return NextResponse.json(
          { error: "Summoner or matches not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Riot API error: ${error.message}` },
        { status: error.status }
      );
    }

    console.error("Match history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
