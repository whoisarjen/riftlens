import { NextRequest, NextResponse } from "next/server";
import {
  getChampionTierList,
  getAllChampions,
} from "@/lib/db/queries/champion-stats";
import type { ChampionTierEntry } from "@/lib/types/internal";
import type { Role } from "@/lib/constants";

/**
 * Assign a letter tier (S/A/B/C/D) based on win rate.
 */
function assignTier(winRate: number): "S" | "A" | "B" | "C" | "D" {
  if (winRate >= 53) return "S";
  if (winRate >= 51) return "A";
  if (winRate >= 49) return "B";
  if (winRate >= 47) return "C";
  return "D";
}

/**
 * GET /api/champions?patch=&tier=&role=
 *
 * Returns champion tier list data as ChampionTierEntry[].
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const patch =
      searchParams.get("patch") ||
      process.env.NEXT_PUBLIC_DDRAGON_VERSION ||
      "15.10.1";
    const tier = searchParams.get("tier") || "ALL";
    const role = searchParams.get("role") || "ALL";

    const stats = await getChampionTierList(patch, tier, role);

    // If we have stats data, transform into ChampionTierEntry[]
    if (stats.length > 0) {
      const entries: ChampionTierEntry[] = stats.map((s) => {
        const winRate =
          s.gamesPlayed > 0 ? (s.wins / s.gamesPlayed) * 100 : 0;
        const pickRate =
          s.totalGames > 0 ? (s.picks / s.totalGames) * 100 : 0;
        const banRate =
          s.totalGames > 0 ? (s.bans / s.totalGames) * 100 : 0;
        const avgKills = s.avgKills ?? 0;
        const avgDeaths = s.avgDeaths ?? 1;
        const avgAssists = s.avgAssists ?? 0;
        const avgKDA =
          avgDeaths > 0 ? (avgKills + avgAssists) / avgDeaths : avgKills + avgAssists;

        return {
          championId: s.championId,
          championName: s.championName,
          championKey: s.championKey,
          role: (s.role || "MID") as Role,
          tier: assignTier(winRate),
          winRate: Math.round(winRate * 100) / 100,
          pickRate: Math.round(pickRate * 100) / 100,
          banRate: Math.round(banRate * 100) / 100,
          gamesPlayed: s.gamesPlayed,
          avgKDA: Math.round(avgKDA * 100) / 100,
          winRateDelta: 0,
          pickRateDelta: 0,
        };
      });

      return NextResponse.json(entries);
    }

    // Fallback: return all champions with placeholder stats
    const allChampions = await getAllChampions();
    const fallback: ChampionTierEntry[] = allChampions.map((c) => ({
      championId: c.id,
      championName: c.name,
      championKey: c.key,
      role: "MID" as Role,
      tier: "B" as const,
      winRate: 0,
      pickRate: 0,
      banRate: 0,
      gamesPlayed: 0,
      avgKDA: 0,
      winRateDelta: 0,
      pickRateDelta: 0,
    }));

    return NextResponse.json(fallback);
  } catch (error) {
    console.error("Champion tier list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch champion tier list" },
      { status: 500 }
    );
  }
}
