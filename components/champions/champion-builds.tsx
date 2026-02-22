import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemImageUrl } from "@/lib/riot/ddragon";
import type { ChampionBuild } from "@/lib/types/internal";
import { Package } from "lucide-react";

interface ChampionBuildsProps {
  builds: ChampionBuild[];
  version: string;
}

export function ChampionBuilds({ builds, version }: ChampionBuildsProps) {
  if (builds.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
          <Package className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Not enough data yet. Builds will appear as more matches are
            analyzed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {builds.map((build, index) => (
        <Card key={index} className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">
                Build #{index + 1}
              </CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">
                  <span className="font-mono text-[#22C55E]">
                    {build.winRate.toFixed(1)}%
                  </span>{" "}
                  WR
                </span>
                <span className="text-muted-foreground">
                  <span className="font-mono text-foreground">
                    {build.pickRate.toFixed(1)}%
                  </span>{" "}
                  PR
                </span>
                <span className="text-muted-foreground">
                  <span className="font-mono text-muted-foreground">
                    {build.games.toLocaleString()}
                  </span>{" "}
                  games
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {build.items.map((itemId, itemIdx) => (
                <div
                  key={itemIdx}
                  className="relative overflow-hidden rounded border border-border"
                >
                  <Image
                    src={itemImageUrl(version, itemId)}
                    alt={`Item ${itemId}`}
                    width={40}
                    height={40}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
