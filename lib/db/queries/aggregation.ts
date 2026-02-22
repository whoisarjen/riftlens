import { db } from "@/lib/db";
import { championStats, matchParticipants, matches } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Aggregate champion statistics from match_participants joined with matches.
 * Groups by championId and role, computing wins, games played, and average KDA.
 * Upserts results into the champion_stats table with tier="ALL".
 *
 * @param patchVersion - The patch prefix to filter on (e.g. "15.10")
 */
export async function aggregateChampionStats(
  patchVersion: string
): Promise<number> {
  // Query aggregated stats from match data
  const aggregated = await db
    .select({
      championId: matchParticipants.championId,
      role: matchParticipants.role,
      gamesPlayed: sql<number>`count(*)`.as("games_played"),
      wins: sql<number>`sum(case when ${matchParticipants.win} then 1 else 0 end)`.as(
        "wins"
      ),
      avgKills: sql<number>`avg(${matchParticipants.kills})`.as("avg_kills"),
      avgDeaths: sql<number>`avg(${matchParticipants.deaths})`.as("avg_deaths"),
      avgAssists: sql<number>`avg(${matchParticipants.assists})`.as(
        "avg_assists"
      ),
    })
    .from(matchParticipants)
    .innerJoin(matches, eq(matches.matchId, matchParticipants.matchId))
    .where(sql`${matches.gameVersion} LIKE ${patchVersion + "%"}`)
    .groupBy(matchParticipants.championId, matchParticipants.role);

  if (aggregated.length === 0) {
    return 0;
  }

  // Compute total games across all champions for pick rate calculation
  const totalGamesResult = await db
    .select({
      total: sql<number>`count(*)`.as("total"),
    })
    .from(matchParticipants)
    .innerJoin(matches, eq(matches.matchId, matchParticipants.matchId))
    .where(sql`${matches.gameVersion} LIKE ${patchVersion + "%"}`);

  const totalGames = totalGamesResult[0]?.total ?? 0;

  // Upsert each aggregated row into champion_stats
  for (const row of aggregated) {
    const role = row.role ?? "UNKNOWN";

    await db
      .insert(championStats)
      .values({
        championId: row.championId,
        patchVersion,
        tier: "ALL",
        role,
        gamesPlayed: row.gamesPlayed,
        wins: row.wins,
        picks: row.gamesPlayed,
        bans: 0,
        totalGames,
        avgKills: row.avgKills,
        avgDeaths: row.avgDeaths,
        avgAssists: row.avgAssists,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [
          championStats.championId,
          championStats.patchVersion,
          championStats.tier,
          championStats.role,
        ],
        set: {
          gamesPlayed: row.gamesPlayed,
          wins: row.wins,
          picks: row.gamesPlayed,
          totalGames,
          avgKills: row.avgKills,
          avgDeaths: row.avgDeaths,
          avgAssists: row.avgAssists,
          updatedAt: new Date(),
        },
      });
  }

  return aggregated.length;
}
