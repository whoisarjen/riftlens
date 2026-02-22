import { NextResponse } from "next/server";
import { getChampionMastery } from "@/lib/riot/summoner";
import { RiotApiError } from "@/lib/riot/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ region: string; puuid: string }> }
) {
  try {
    const { region, puuid } = await params;

    // Read optional count query param
    const { searchParams } = new URL(request.url);
    const count = Math.min(
      Math.max(parseInt(searchParams.get("count") ?? "7", 10) || 7, 1),
      50
    );

    const mastery = await getChampionMastery(region, puuid, count);

    return NextResponse.json(mastery);
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

    console.error("Champion mastery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
