import { NextRequest, NextResponse } from "next/server";
import {
  getChampionById,
  getChampionStats,
} from "@/lib/db/queries/champion-stats";
import type { ChampionPageData } from "@/lib/types/internal";
import type { Role } from "@/lib/constants";

/**
 * GET /api/champions/[id]
 *
 * Returns detailed champion data including stats, builds, runes, matchups.
 * Builds and matchups are placeholder/empty for now until more data is available.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const championId = parseInt(id, 10);

    if (isNaN(championId)) {
      return NextResponse.json(
        { error: "Invalid champion ID" },
        { status: 400 }
      );
    }

    const champion = await getChampionById(championId);

    if (!champion) {
      return NextResponse.json(
        { error: "Champion not found" },
        { status: 404 }
      );
    }

    const patch =
      process.env.NEXT_PUBLIC_DDRAGON_VERSION ||
      champion.patchVersion ||
      "15.10.1";

    // Get stats for this champion (aggregated across all tiers)
    const stats = await getChampionStats(championId, patch);

    // Compute totals across all roles
    let totalWins = 0;
    let totalGames = 0;
    let totalPicks = 0;
    let totalBans = 0;
    let overallTotalGames = 0;
    let bestRole: Role = "MID";
    let bestRoleGames = 0;

    for (const s of stats) {
      totalWins += s.wins;
      totalGames += s.gamesPlayed;
      totalPicks += s.picks;
      totalBans += s.bans;
      overallTotalGames = Math.max(overallTotalGames, s.totalGames);
      if (s.gamesPlayed > bestRoleGames) {
        bestRoleGames = s.gamesPlayed;
        bestRole = (s.role || "MID") as Role;
      }
    }

    const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0;
    const pickRate =
      overallTotalGames > 0 ? (totalPicks / overallTotalGames) * 100 : 0;
    const banRate =
      overallTotalGames > 0 ? (totalBans / overallTotalGames) * 100 : 0;

    const tags = (champion.tags as string[]) ?? [];

    const data: ChampionPageData = {
      championId: champion.id,
      championName: champion.name,
      championKey: champion.key,
      championTitle: champion.title,
      tags,
      role: bestRole,
      winRate: Math.round(winRate * 100) / 100,
      pickRate: Math.round(pickRate * 100) / 100,
      banRate: Math.round(banRate * 100) / 100,
      gamesPlayed: totalGames,
      builds: [],
      runes: [],
      skillOrder: [],
      matchups: [],
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Champion detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch champion data" },
      { status: 500 }
    );
  }
}
