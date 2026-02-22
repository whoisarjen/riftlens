import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { runeIconUrl } from "@/lib/riot/ddragon";
import type { ChampionRunePage } from "@/lib/types/internal";
import { Sparkles } from "lucide-react";

interface ChampionRunesProps {
  runes: ChampionRunePage[];
  version: string;
}

export function ChampionRunes({ runes }: ChampionRunesProps) {
  if (runes.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
          <Sparkles className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Not enough data yet. Rune pages will appear as more matches are
            analyzed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {runes.map((runePage, index) => (
        <Card key={index} className="border-border bg-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">
                Rune Page #{index + 1}
              </CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">
                  <span className="font-mono text-[#22C55E]">
                    {runePage.winRate.toFixed(1)}%
                  </span>{" "}
                  WR
                </span>
                <span className="text-muted-foreground">
                  <span className="font-mono text-foreground">
                    {runePage.pickRate.toFixed(1)}%
                  </span>{" "}
                  PR
                </span>
                <span className="text-muted-foreground">
                  <span className="font-mono text-muted-foreground">
                    {runePage.games.toLocaleString()}
                  </span>{" "}
                  games
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-8">
              {/* Primary tree */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  Primary
                </p>
                <div className="flex flex-wrap gap-2">
                  {runePage.primaryRunes.map((runeId, runeIdx) => (
                    <div
                      key={runeIdx}
                      className="relative h-8 w-8 overflow-hidden rounded-full border border-border bg-surface"
                    >
                      <Image
                        src={runeIconUrl(`perk-images/${runeId}.png`)}
                        alt={`Rune ${runeId}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary tree */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  Secondary
                </p>
                <div className="flex flex-wrap gap-2">
                  {runePage.secondaryRunes.map((runeId, runeIdx) => (
                    <div
                      key={runeIdx}
                      className="relative h-8 w-8 overflow-hidden rounded-full border border-border bg-surface"
                    >
                      <Image
                        src={runeIconUrl(`perk-images/${runeId}.png`)}
                        alt={`Rune ${runeId}`}
                        width={32}
                        height={32}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
