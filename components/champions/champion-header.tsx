import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { championImageUrl } from "@/lib/riot/ddragon";
import type { ChampionPageData } from "@/lib/types/internal";

interface ChampionHeaderProps {
  champion: ChampionPageData;
  version: string;
}

export function ChampionHeader({ champion, version }: ChampionHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      {/* Champion icon */}
      <Image
        src={championImageUrl(version, champion.championKey)}
        alt={champion.championName}
        width={100}
        height={100}
        className="rounded-lg border border-border"
        priority
      />

      <div className="flex-1 space-y-3">
        {/* Name and title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {champion.championName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {champion.championTitle}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {champion.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          <Badge
            variant="secondary"
            className="text-xs"
          >
            {champion.role}
          </Badge>
        </div>

        {/* Key stats */}
        <div className="flex flex-wrap gap-6 pt-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Win Rate
            </p>
            <p className="font-mono text-2xl font-bold text-foreground">
              {champion.gamesPlayed > 0
                ? `${champion.winRate.toFixed(1)}%`
                : "--"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Pick Rate
            </p>
            <p className="font-mono text-2xl font-bold text-foreground">
              {champion.gamesPlayed > 0
                ? `${champion.pickRate.toFixed(1)}%`
                : "--"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Ban Rate
            </p>
            <p className="font-mono text-2xl font-bold text-foreground">
              {champion.gamesPlayed > 0
                ? `${champion.banRate.toFixed(1)}%`
                : "--"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Games
            </p>
            <p className="font-mono text-2xl font-bold text-muted-foreground">
              {champion.gamesPlayed > 0
                ? champion.gamesPlayed.toLocaleString()
                : "--"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
