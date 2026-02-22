import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { cn, formatGameDuration, formatTimeAgo, formatKDA, queueName, csPerMinute, kdaColor } from "@/lib/utils";
import { championImageUrl, itemImageUrl } from "@/lib/riot/ddragon";
import type { MatchSummary } from "@/lib/types/internal";

interface MatchCardProps {
  match: MatchSummary;
  version: string;
}

export function MatchCard({ match, version }: MatchCardProps) {
  const kdaRatio = match.deaths === 0 ? "Perfect" : formatKDA(match.kills, match.deaths, match.assists);
  const kdaNum = match.deaths === 0 ? 99 : (match.kills + match.assists) / match.deaths;
  const csMin = csPerMinute(match.cs, match.gameDuration);

  const team1 = match.participants.filter((p) => p.teamId === 100);
  const team2 = match.participants.filter((p) => p.teamId === 200);

  return (
    <Link href={`/match/${match.matchId}`} className="block">
      <div
        className={cn(
          "group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-card/80 md:gap-4 md:p-4",
          match.win
            ? "border-l-[3px] border-l-[#22C55E] border-y-border/50 border-r-border/50"
            : "border-l-[3px] border-l-[#EF4444] border-y-border/50 border-r-border/50"
        )}
      >
        {/* Champion icon */}
        <div className="shrink-0">
          <Image
            src={championImageUrl(version, match.championName)}
            alt={match.championName}
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>

        {/* Game info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-6">
          {/* Mode + result + duration */}
          <div className="flex flex-col gap-0.5 md:w-28">
            <span className="text-xs font-medium text-muted-foreground">
              {queueName(match.queueId)}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                match.win ? "text-[#22C55E]" : "text-[#EF4444]"
              )}
            >
              {match.win ? "Victory" : "Defeat"}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {formatGameDuration(match.gameDuration)}
            </span>
          </div>

          {/* KDA */}
          <div className="flex flex-col gap-0.5 md:w-28">
            <span className="font-mono text-sm">
              <span className="text-foreground">{match.kills}</span>
              {" / "}
              <span className="text-[#EF4444]">{match.deaths}</span>
              {" / "}
              <span className="text-foreground">{match.assists}</span>
            </span>
            <span className={cn("font-mono text-xs", kdaColor(kdaNum))}>
              {kdaRatio} KDA
            </span>
          </div>

          {/* CS + Vision */}
          <div className="flex flex-col gap-0.5 md:w-24">
            <span className="font-mono text-xs text-muted-foreground">
              {match.cs} CS ({csMin}/m)
            </span>
            <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {match.visionScore}
            </span>
          </div>

          {/* Items */}
          <div className="flex items-center gap-0.5">
            {match.items.slice(0, 7).map((itemId, i) => (
              <div key={i} className="shrink-0">
                {itemId > 0 ? (
                  <Image
                    src={itemImageUrl(version, itemId)}
                    alt={`Item ${itemId}`}
                    width={28}
                    height={28}
                    className="rounded"
                  />
                ) : (
                  <div className="h-7 w-7 rounded bg-secondary" />
                )}
              </div>
            ))}
          </div>

          {/* Participants mini list - hidden on mobile */}
          <div className="hidden flex-col gap-0.5 lg:flex">
            <div className="flex items-center gap-0.5">
              {team1.slice(0, 5).map((p) => (
                <Image
                  key={p.puuid}
                  src={championImageUrl(version, p.championName)}
                  alt={p.championName}
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
              ))}
            </div>
            <div className="flex items-center gap-0.5">
              {team2.slice(0, 5).map((p) => (
                <Image
                  key={p.puuid}
                  src={championImageUrl(version, p.championName)}
                  alt={p.championName}
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Time ago */}
        <div className="shrink-0 text-right">
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(match.gameStartTimestamp)}
          </span>
        </div>
      </div>
    </Link>
  );
}
