import { riotFetch } from "./client";
import type { MatchDTO, MatchTimelineDTO } from "@/lib/types/riot";

export async function getMatchIds(
  platform: string,
  puuid: string,
  count: number = 20,
  start: number = 0
): Promise<string[]> {
  return riotFetch<string[]>(
    platform,
    `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`,
    "regional"
  );
}

export async function getMatch(
  platform: string,
  matchId: string
): Promise<MatchDTO> {
  return riotFetch<MatchDTO>(
    platform,
    `/lol/match/v5/matches/${matchId}`,
    "regional"
  );
}

export async function getMatchTimeline(
  platform: string,
  matchId: string
): Promise<MatchTimelineDTO> {
  return riotFetch<MatchTimelineDTO>(
    platform,
    `/lol/match/v5/matches/${matchId}/timeline`,
    "regional"
  );
}
