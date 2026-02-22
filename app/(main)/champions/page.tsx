import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllChampions } from "@/lib/db/queries/champion-stats";
import { getChampionTierList } from "@/lib/db/queries/champion-stats";
import { ChampionFilters } from "@/components/champions/champion-filters";
import { ChampionTierTable } from "@/components/champions/champion-tier-table";
import type { ChampionTierEntry } from "@/lib/types/internal";
import type { Role } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Champion Tier List | Riftlens",
  description:
    "View the latest champion tier list with win rates, pick rates, and ban rates across all roles and ranks.",
};

function assignTier(winRate: number): "S" | "A" | "B" | "C" | "D" {
  if (winRate >= 53) return "S";
  if (winRate >= 51) return "A";
  if (winRate >= 49) return "B";
  if (winRate >= 47) return "C";
  return "D";
}

interface ChampionsPageProps {
  searchParams: Promise<{
    role?: string;
    tier?: string;
    search?: string;
    patch?: string;
  }>;
}

export default async function ChampionsPage({
  searchParams,
}: ChampionsPageProps) {
  const params = await searchParams;
  const role = params.role || "ALL";
  const tier = params.tier || "ALL";
  const search = params.search || "";
  const patch =
    params.patch || process.env.NEXT_PUBLIC_DDRAGON_VERSION || "15.10.1";
  const version = process.env.NEXT_PUBLIC_DDRAGON_VERSION || "15.10.1";

  // Try to get stats data first
  const stats = await getChampionTierList(patch, tier, role);

  let entries: ChampionTierEntry[];

  if (stats.length > 0) {
    entries = stats.map((s) => {
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
        avgDeaths > 0
          ? (avgKills + avgAssists) / avgDeaths
          : avgKills + avgAssists;

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
  } else {
    // Fallback: show all champions from DB with placeholder stats
    const allChampions = await getAllChampions();
    entries = allChampions.map((c) => ({
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
  }

  // Apply client-side search filter
  if (search) {
    const lowerSearch = search.toLowerCase();
    entries = entries.filter((e) =>
      e.championName.toLowerCase().includes(lowerSearch)
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Champion Tier List
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Patch {patch} — Win rates, pick rates, and performance metrics across
          all champions.
        </p>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <ChampionFilters />
      </Suspense>

      {/* Tier table */}
      <ChampionTierTable champions={entries} version={version} />
    </div>
  );
}
