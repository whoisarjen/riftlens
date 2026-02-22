import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { matches, matchParticipants } from "@/lib/db/schema";
import type { MatchDTO, MatchParticipantDTO } from "@/lib/types/riot";

/**
 * Fetch cached matches for a given puuid, ordered by game start descending.
 * Returns joined match + participant data.
 */
export async function getCachedMatches(puuid: string, limit: number = 20) {
  const rows = await db
    .select({
      matchId: matches.matchId,
      region: matches.region,
      queueId: matches.queueId,
      gameMode: matches.gameMode,
      gameDuration: matches.gameDuration,
      gameVersion: matches.gameVersion,
      gameStartTs: matches.gameStartTs,
      participantId: matchParticipants.participantId,
      puuid: matchParticipants.puuid,
      teamId: matchParticipants.teamId,
      championId: matchParticipants.championId,
      championName: matchParticipants.championName,
      riotIdGameName: matchParticipants.riotIdGameName,
      riotIdTagline: matchParticipants.riotIdTagline,
      role: matchParticipants.role,
      lane: matchParticipants.lane,
      win: matchParticipants.win,
      kills: matchParticipants.kills,
      deaths: matchParticipants.deaths,
      assists: matchParticipants.assists,
      champLevel: matchParticipants.champLevel,
      totalMinionsKilled: matchParticipants.totalMinionsKilled,
      visionScore: matchParticipants.visionScore,
      goldEarned: matchParticipants.goldEarned,
      totalDamageDealt: matchParticipants.totalDamageDealt,
      physicalDamage: matchParticipants.physicalDamage,
      magicDamage: matchParticipants.magicDamage,
      trueDamage: matchParticipants.trueDamage,
      damageTaken: matchParticipants.damageTaken,
      wardsPlaced: matchParticipants.wardsPlaced,
      wardsKilled: matchParticipants.wardsKilled,
      item0: matchParticipants.item0,
      item1: matchParticipants.item1,
      item2: matchParticipants.item2,
      item3: matchParticipants.item3,
      item4: matchParticipants.item4,
      item5: matchParticipants.item5,
      item6: matchParticipants.item6,
      summoner1Id: matchParticipants.summoner1Id,
      summoner2Id: matchParticipants.summoner2Id,
      primaryRuneStyle: matchParticipants.primaryRuneStyle,
      primaryRune0: matchParticipants.primaryRune0,
      secondaryRuneStyle: matchParticipants.secondaryRuneStyle,
    })
    .from(matchParticipants)
    .innerJoin(matches, eq(matches.matchId, matchParticipants.matchId))
    .where(eq(matchParticipants.puuid, puuid))
    .orderBy(desc(matches.gameStartTs))
    .limit(limit);

  return rows;
}

/**
 * Fetch a single match with all its participants.
 */
export async function getMatchDetail(matchId: string) {
  const matchRows = await db
    .select()
    .from(matches)
    .where(eq(matches.matchId, matchId))
    .limit(1);

  if (matchRows.length === 0) return null;

  const participantRows = await db
    .select()
    .from(matchParticipants)
    .where(eq(matchParticipants.matchId, matchId));

  return {
    match: matchRows[0],
    participants: participantRows,
  };
}

/**
 * Check whether a match already exists in the database.
 */
export async function isMatchCached(matchId: string): Promise<boolean> {
  const rows = await db
    .select({ id: matches.id })
    .from(matches)
    .where(eq(matches.matchId, matchId))
    .limit(1);

  return rows.length > 0;
}

/**
 * Insert a match and all its participants.
 * Uses ON CONFLICT DO NOTHING so duplicate inserts are safely skipped.
 */
export async function upsertMatch(
  matchData: MatchDTO,
  region: string
): Promise<void> {
  const info = matchData.info;
  const meta = matchData.metadata;

  // Insert the match itself
  await db
    .insert(matches)
    .values({
      matchId: meta.matchId,
      region,
      queueId: info.queueId,
      gameMode: info.gameMode,
      gameDuration: info.gameDuration,
      gameVersion: info.gameVersion,
      gameStartTs: info.gameStartTimestamp,
    })
    .onConflictDoNothing({ target: matches.matchId });

  // Insert all participants
  if (info.participants.length > 0) {
    const participantValues = info.participants.map((p: MatchParticipantDTO) => ({
      matchId: meta.matchId,
      puuid: p.puuid,
      participantId: p.participantId,
      teamId: p.teamId,
      championId: p.championId,
      championName: p.championName,
      riotIdGameName: p.riotIdGameName ?? null,
      riotIdTagline: p.riotIdTagline ?? null,
      role: p.teamPosition || p.lane || null,
      lane: p.lane || null,
      win: p.win,
      kills: p.kills,
      deaths: p.deaths,
      assists: p.assists,
      champLevel: p.champLevel,
      totalMinionsKilled: p.totalMinionsKilled + (p.neutralMinionsKilled ?? 0),
      visionScore: p.visionScore,
      goldEarned: p.goldEarned,
      totalDamageDealt: p.totalDamageDealtToChampions,
      physicalDamage: p.physicalDamageDealtToChampions,
      magicDamage: p.magicDamageDealtToChampions,
      trueDamage: p.trueDamageDealtToChampions,
      damageTaken: p.totalDamageTaken,
      wardsPlaced: p.wardsPlaced,
      wardsKilled: p.wardsKilled,
      item0: p.item0,
      item1: p.item1,
      item2: p.item2,
      item3: p.item3,
      item4: p.item4,
      item5: p.item5,
      item6: p.item6,
      summoner1Id: p.summoner1Id,
      summoner2Id: p.summoner2Id,
      primaryRuneStyle: p.perks?.styles?.[0]?.style ?? null,
      primaryRune0: p.perks?.styles?.[0]?.selections?.[0]?.perk ?? null,
      secondaryRuneStyle: p.perks?.styles?.[1]?.style ?? null,
    }));

    await db
      .insert(matchParticipants)
      .values(participantValues)
      .onConflictDoNothing();
  }
}

/**
 * Get all participants for a given match (used to build MatchSummary).
 */
export async function getMatchParticipants(matchId: string) {
  return db
    .select()
    .from(matchParticipants)
    .where(eq(matchParticipants.matchId, matchId));
}
