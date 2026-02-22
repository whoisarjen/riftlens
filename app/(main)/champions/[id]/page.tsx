import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getChampionById,
  getChampionStats,
} from "@/lib/db/queries/champion-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ChampionHeader } from "@/components/champions/champion-header";
import { ChampionBuilds } from "@/components/champions/champion-builds";
import { ChampionRunes } from "@/components/champions/champion-runes";
import { ChampionMatchups } from "@/components/champions/champion-matchups";
import { ChampionSkillOrder } from "@/components/champions/champion-skill-order";
import type { ChampionPageData } from "@/lib/types/internal";
import type { Role } from "@/lib/constants";

interface ChampionDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ChampionDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const championId = parseInt(id, 10);

  if (isNaN(championId)) {
    return { title: "Champion Not Found | Riftlens" };
  }

  const champion = await getChampionById(championId);

  if (!champion) {
    return { title: "Champion Not Found | Riftlens" };
  }

  return {
    title: `${champion.name} Stats & Build | Riftlens`,
    description: `${champion.name} - ${champion.title}. View win rate, pick rate, best builds, runes, and matchups.`,
  };
}

export default async function ChampionDetailPage({
  params,
}: ChampionDetailPageProps) {
  const { id } = await params;
  const championId = parseInt(id, 10);

  if (isNaN(championId)) {
    notFound();
  }

  const champion = await getChampionById(championId);

  if (!champion) {
    notFound();
  }

  const version =
    process.env.NEXT_PUBLIC_DDRAGON_VERSION || champion.patchVersion || "15.10.1";
  const patch = champion.patchVersion || version;

  // Get stats for this champion
  const stats = await getChampionStats(championId, patch);

  // Compute aggregate stats
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

  const championData: ChampionPageData = {
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

  return (
    <div className="space-y-6">
      {/* Champion header */}
      <ChampionHeader champion={championData} version={version} />

      {/* Tabs section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="builds">Builds</TabsTrigger>
          <TabsTrigger value="runes">Runes</TabsTrigger>
          <TabsTrigger value="matchups">Matchups</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-6">
          {totalGames > 0 ? (
            <>
              {/* Stats summary cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                  label="Win Rate"
                  value={`${championData.winRate.toFixed(1)}%`}
                  valueColor={
                    championData.winRate > 52
                      ? "text-[#22C55E]"
                      : championData.winRate < 48
                        ? "text-[#EF4444]"
                        : "text-foreground"
                  }
                />
                <StatCard
                  label="Pick Rate"
                  value={`${championData.pickRate.toFixed(1)}%`}
                />
                <StatCard
                  label="Ban Rate"
                  value={`${championData.banRate.toFixed(1)}%`}
                />
                <StatCard
                  label="Games Analyzed"
                  value={championData.gamesPlayed.toLocaleString()}
                />
              </div>

              {/* Skill order */}
              <ChampionSkillOrder skillOrder={championData.skillOrder} />
            </>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
                <p className="text-lg font-medium text-foreground">
                  Data collecting...
                </p>
                <p className="text-sm text-muted-foreground">
                  Stats for {championData.championName} will appear once enough
                  matches have been analyzed. Try syncing Data Dragon first.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Builds tab */}
        <TabsContent value="builds">
          <ChampionBuilds builds={championData.builds} version={version} />
        </TabsContent>

        {/* Runes tab */}
        <TabsContent value="runes">
          <ChampionRunes runes={championData.runes} version={version} />
        </TabsContent>

        {/* Matchups tab */}
        <TabsContent value="matchups">
          <ChampionMatchups
            matchups={championData.matchups}
            version={version}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  label,
  value,
  valueColor = "text-foreground",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col items-center justify-center py-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className={`mt-1 font-mono text-xl font-bold ${valueColor}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
