import { MatchCard } from "./match-card";
import type { MatchSummary } from "@/lib/types/internal";

interface MatchHistoryProps {
  matches: MatchSummary[];
  version: string;
}

export function MatchHistory({ matches, version }: MatchHistoryProps) {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Match History</h2>

      {matches.length === 0 ? (
        <div className="rounded-lg border border-border/50 bg-card p-8 text-center">
          <p className="text-muted-foreground">
            No recent matches found for this summoner.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {matches.map((match) => (
            <MatchCard key={match.matchId} match={match} version={version} />
          ))}
        </div>
      )}
    </section>
  );
}
