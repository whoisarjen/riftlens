"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatWinRate, tierToColor } from "@/lib/utils";
import type { RankedInfo as RankedInfoType } from "@/lib/types/internal";

interface RankedInfoProps {
  soloRank: RankedInfoType | null;
  flexRank: RankedInfoType | null;
}

function RankedCard({
  title,
  rank,
}: {
  title: string;
  rank: RankedInfoType | null;
}) {
  if (!rank) {
    return (
      <Card className="border-border/50">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-4">
            <p className="text-lg font-medium text-muted-foreground">
              Unranked
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = rank.wins + rank.losses;
  const winRateNum = total > 0 ? (rank.wins / total) * 100 : 0;
  const tierColor = tierToColor(rank.tier);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/* Tier + Rank */}
          <p className="text-xl font-bold" style={{ color: tierColor }}>
            {rank.tier} {rank.rank}
          </p>

          {/* LP */}
          <p className="font-mono text-sm">
            <span className="text-primary font-semibold">{rank.lp} LP</span>
          </p>

          {/* Win/Loss */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-mono">
              <span className="text-[#22C55E]">{rank.wins}W</span>
              {" "}
              <span className="text-[#EF4444]">{rank.losses}L</span>
            </span>
          </div>

          {/* Win rate */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="font-mono font-medium">
                {formatWinRate(rank.wins, rank.losses)}
              </span>
            </div>
            <Progress
              value={winRateNum}
              className="h-1.5 bg-[#EF4444]/20"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RankedInfo({ soloRank, flexRank }: RankedInfoProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <RankedCard title="Ranked Solo/Duo" rank={soloRank} />
      <RankedCard title="Ranked Flex" rank={flexRank} />
    </div>
  );
}
