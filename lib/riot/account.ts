import { riotFetch } from "./client";
import type { RiotAccount } from "@/lib/types/riot";

export async function getAccountByRiotId(
  platform: string,
  gameName: string,
  tagLine: string
): Promise<RiotAccount> {
  return riotFetch<RiotAccount>(
    platform,
    `/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    "regional"
  );
}

export async function getAccountByPuuid(
  platform: string,
  puuid: string
): Promise<RiotAccount> {
  return riotFetch<RiotAccount>(
    platform,
    `/riot/account/v1/accounts/by-puuid/${puuid}`,
    "regional"
  );
}
