import { db } from "@/lib/db";
import { championStats, champions } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * Get tier list data from champion_stats joined with champions.
 * Filter by patch, tier (or "ALL"), role (or "ALL").
 * Results ordered by games played descending.
 */
export async function getChampionTierList(
  patch: string,
  tier: string,
  role: string
) {
  const results = await db
    .select({
      championId: championStats.championId,
      championName: champions.name,
      championKey: champions.key,
      role: championStats.role,
      gamesPlayed: championStats.gamesPlayed,
      wins: championStats.wins,
      picks: championStats.picks,
      bans: championStats.bans,
      totalGames: championStats.totalGames,
      avgKills: championStats.avgKills,
      avgDeaths: championStats.avgDeaths,
      avgAssists: championStats.avgAssists,
    })
    .from(championStats)
    .innerJoin(champions, eq(championStats.championId, champions.id))
    .where(
      and(
        eq(championStats.patchVersion, patch),
        tier !== "ALL" ? eq(championStats.tier, tier) : undefined,
        role !== "ALL" ? eq(championStats.role, role) : undefined
      )
    )
    .orderBy(desc(championStats.gamesPlayed));

  return results;
}

/**
 * Get a single champion's stats for a given patch.
 */
export async function getChampionStats(championId: number, patch: string) {
  const results = await db
    .select({
      role: championStats.role,
      gamesPlayed: championStats.gamesPlayed,
      wins: championStats.wins,
      picks: championStats.picks,
      bans: championStats.bans,
      totalGames: championStats.totalGames,
      avgKills: championStats.avgKills,
      avgDeaths: championStats.avgDeaths,
      avgAssists: championStats.avgAssists,
    })
    .from(championStats)
    .where(
      and(
        eq(championStats.championId, championId),
        eq(championStats.patchVersion, patch),
        eq(championStats.tier, "ALL")
      )
    )
    .orderBy(desc(championStats.gamesPlayed));

  return results;
}

/**
 * Get all champions from the DB (for listing when no stats exist yet).
 */
export async function getAllChampions() {
  return db.select().from(champions).orderBy(champions.name);
}

/**
 * Get a single champion by numeric id.
 */
export async function getChampionById(id: number) {
  const rows = await db
    .select()
    .from(champions)
    .where(eq(champions.id, id))
    .limit(1);

  return rows[0] ?? null;
}
