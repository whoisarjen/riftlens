import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { summoners } from "@/lib/db/schema";
import type { SummonerProfile, RankedInfo } from "@/lib/types/internal";

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Retrieve a cached summoner by Riot ID and region.
 * Returns null if no record exists or if the record is stale (> 5 min).
 */
export async function getCachedSummoner(
  region: string,
  gameName: string,
  tagLine: string
): Promise<SummonerProfile | null> {
  const rows = await db
    .select()
    .from(summoners)
    .where(
      and(
        eq(summoners.region, region),
        sql`LOWER(${summoners.gameName}) = LOWER(${gameName})`,
        sql`LOWER(${summoners.tagLine}) = LOWER(${tagLine})`
      )
    )
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];

  // Check staleness
  const age = Date.now() - new Date(row.updatedAt).getTime();
  if (age > STALE_THRESHOLD_MS) return null;

  return rowToProfile(row);
}

/**
 * Insert or update a summoner record. Uses ON CONFLICT on puuid.
 */
export async function upsertSummoner(data: SummonerProfile): Promise<void> {
  await db
    .insert(summoners)
    .values({
      puuid: data.puuid,
      gameName: data.gameName,
      tagLine: data.tagLine,
      region: data.region,
      summonerId: data.summonerId ?? null,
      profileIconId: data.profileIconId,
      summonerLevel: data.summonerLevel,
      soloTier: data.soloRank?.tier ?? null,
      soloRank: data.soloRank?.rank ?? null,
      soloLp: data.soloRank?.lp ?? null,
      soloWins: data.soloRank?.wins ?? null,
      soloLosses: data.soloRank?.losses ?? null,
      flexTier: data.flexRank?.tier ?? null,
      flexRank: data.flexRank?.rank ?? null,
      flexLp: data.flexRank?.lp ?? null,
      flexWins: data.flexRank?.wins ?? null,
      flexLosses: data.flexRank?.losses ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: summoners.puuid,
      set: {
        gameName: data.gameName,
        tagLine: data.tagLine,
        region: data.region,
        summonerId: data.summonerId ?? null,
        profileIconId: data.profileIconId,
        summonerLevel: data.summonerLevel,
        soloTier: data.soloRank?.tier ?? null,
        soloRank: data.soloRank?.rank ?? null,
        soloLp: data.soloRank?.lp ?? null,
        soloWins: data.soloRank?.wins ?? null,
        soloLosses: data.soloRank?.losses ?? null,
        flexTier: data.flexRank?.tier ?? null,
        flexRank: data.flexRank?.rank ?? null,
        flexLp: data.flexRank?.lp ?? null,
        flexWins: data.flexRank?.wins ?? null,
        flexLosses: data.flexRank?.losses ?? null,
        updatedAt: new Date(),
      },
    });
}

// ── helpers ───────────────────────────────────────────────────

function rowToProfile(
  row: typeof summoners.$inferSelect
): SummonerProfile {
  const soloRank: RankedInfo | null =
    row.soloTier && row.soloRank
      ? {
          tier: row.soloTier,
          rank: row.soloRank,
          lp: row.soloLp ?? 0,
          wins: row.soloWins ?? 0,
          losses: row.soloLosses ?? 0,
        }
      : null;

  const flexRank: RankedInfo | null =
    row.flexTier && row.flexRank
      ? {
          tier: row.flexTier,
          rank: row.flexRank,
          lp: row.flexLp ?? 0,
          wins: row.flexWins ?? 0,
          losses: row.flexLosses ?? 0,
        }
      : null;

  return {
    puuid: row.puuid,
    gameName: row.gameName,
    tagLine: row.tagLine,
    region: row.region as SummonerProfile["region"],
    summonerId: row.summonerId,
    profileIconId: row.profileIconId,
    summonerLevel: row.summonerLevel,
    soloRank,
    flexRank,
  };
}
