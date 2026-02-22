import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { championImageUrl } from "@/lib/riot/ddragon";
import { cn } from "@/lib/utils";
import type { ChampionMatchup } from "@/lib/types/internal";
import { Swords } from "lucide-react";

interface ChampionMatchupsProps {
  matchups: ChampionMatchup[];
  version: string;
}

export function ChampionMatchups({
  matchups,
  version,
}: ChampionMatchupsProps) {
  if (matchups.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
          <Swords className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Not enough data yet. Matchup data will appear as more matches are
            analyzed.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort matchups: best (highest WR) and worst (lowest WR)
  const sorted = [...matchups].sort((a, b) => b.winRate - a.winRate);
  const bestMatchups = sorted.slice(0, 5);
  const worstMatchups = sorted.slice(-5).reverse();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Best matchups */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[#22C55E]">
            Best Matchups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bestMatchups.map((matchup) => (
            <MatchupRow
              key={matchup.opponentChampionId}
              matchup={matchup}
              version={version}
              type="best"
            />
          ))}
        </CardContent>
      </Card>

      {/* Worst matchups */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[#EF4444]">
            Worst Matchups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {worstMatchups.map((matchup) => (
            <MatchupRow
              key={matchup.opponentChampionId}
              matchup={matchup}
              version={version}
              type="worst"
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MatchupRow({
  matchup,
  version,
  type,
}: {
  matchup: ChampionMatchup;
  version: string;
  type: "best" | "worst";
}) {
  return (
    <Link
      href={`/champions/${matchup.opponentChampionId}`}
      className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted"
    >
      <Image
        src={championImageUrl(version, matchup.opponentChampionName)}
        alt={matchup.opponentChampionName}
        width={28}
        height={28}
        className="rounded"
      />
      <span className="flex-1 text-sm text-foreground">
        {matchup.opponentChampionName}
      </span>
      <span
        className={cn(
          "font-mono text-sm font-medium",
          type === "best" ? "text-[#22C55E]" : "text-[#EF4444]"
        )}
      >
        {matchup.winRate.toFixed(1)}%
      </span>
      <span className="font-mono text-xs text-muted-foreground">
        {matchup.games.toLocaleString()} games
      </span>
    </Link>
  );
}
