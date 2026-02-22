import { NextResponse } from "next/server";
import { getAccountByRiotId } from "@/lib/riot/account";
import { getSummonerByPuuid, getLeagueEntries } from "@/lib/riot/summoner";
import { getCachedSummoner, upsertSummoner } from "@/lib/db/queries/summoner";
import { RiotApiError } from "@/lib/riot/client";
import type { SummonerProfile, RankedInfo } from "@/lib/types/internal";
import type { LeagueEntryDTO } from "@/lib/types/riot";
import type { RegionId } from "@/lib/constants";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ region: string; name: string; tag: string }> }
) {
  try {
    const { region, name, tag } = await params;

    const decodedName = decodeURIComponent(name);
    const decodedTag = decodeURIComponent(tag);

    // 1. Check DB cache
    const cached = await getCachedSummoner(region, decodedName, decodedTag);
    if (cached) {
      return NextResponse.json(cached);
    }

    // 2. Fetch fresh data from Riot API
    const account = await getAccountByRiotId(region, decodedName, decodedTag);
    const summoner = await getSummonerByPuuid(region, account.puuid);
    const leagueEntries = await getLeagueEntries(region, summoner.id);

    // 3. Extract ranked info
    const soloEntry = leagueEntries.find(
      (e: LeagueEntryDTO) => e.queueType === "RANKED_SOLO_5x5"
    );
    const flexEntry = leagueEntries.find(
      (e: LeagueEntryDTO) => e.queueType === "RANKED_FLEX_SR"
    );

    const soloRank: RankedInfo | null = soloEntry
      ? {
          tier: soloEntry.tier,
          rank: soloEntry.rank,
          lp: soloEntry.leaguePoints,
          wins: soloEntry.wins,
          losses: soloEntry.losses,
        }
      : null;

    const flexRank: RankedInfo | null = flexEntry
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
      summonerId: summoner.id,
      profileIconId: summoner.profileIconId,
      summonerLevel: summoner.summonerLevel,
      soloRank,
      flexRank,
    };

    // 5. Cache in DB
    await upsertSummoner(profile);

    // 6. Return
    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof RiotApiError) {
      if (error.status === 404) {
        return NextResponse.json(
          { error: "Summoner not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Riot API error: ${error.message}` },
        { status: error.status }
      );
    }

    console.error("Summoner lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
