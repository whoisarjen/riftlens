import { riotFetch } from "./client";
import type {
  SummonerDTO,
  LeagueEntryDTO,
  ChampionMasteryDTO,
} from "@/lib/types/riot";

export async function getSummonerByPuuid(
  platform: string,
  puuid: string
): Promise<SummonerDTO> {
  return riotFetch<SummonerDTO>(
    platform,
    `/lol/summoner/v4/summoners/by-puuid/${puuid}`
  );
}

export async function getLeagueEntries(
  platform: string,
  summonerId: string
): Promise<LeagueEntryDTO[]> {
  return riotFetch<LeagueEntryDTO[]>(
    platform,
    `/lol/league/v4/entries/by-summoner/${summonerId}`
  );
}

export async function getChampionMastery(
  platform: string,
  puuid: string,
  count: number = 7
): Promise<ChampionMasteryDTO[]> {
  return riotFetch<ChampionMasteryDTO[]>(
    platform,
    `/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`
  );
}
