import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TierBadge } from "@/components/champions/tier-badge";
import { championImageUrl } from "@/lib/riot/ddragon";
import { cn } from "@/lib/utils";
import type { ChampionTierEntry } from "@/lib/types/internal";
import { Info } from "lucide-react";

interface ChampionTierTableProps {
  champions: ChampionTierEntry[];
  version: string;
}

export function ChampionTierTable({
  champions,
  version,
}: ChampionTierTableProps) {
  if (champions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card py-16 text-center">
        <Info className="h-10 w-10 text-muted-foreground" />
        <div>
          <p className="text-lg font-medium text-foreground">
            No champion data available.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sync Data Dragon to populate champion statistics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-12 text-muted-foreground">#</TableHead>
            <TableHead className="text-muted-foreground">Champion</TableHead>
            <TableHead className="text-muted-foreground">Tier</TableHead>
            <TableHead className="text-right text-muted-foreground">
              Win Rate
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              Pick Rate
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              Ban Rate
            </TableHead>
            <TableHead className="text-right text-muted-foreground">
              KDA
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {champions.map((champ, index) => {
            const winRateColor =
              champ.winRate > 52
                ? "text-[#22C55E]"
                : champ.winRate < 48
                  ? "text-[#EF4444]"
                  : "text-foreground";

            return (
              <TableRow
                key={`${champ.championId}-${champ.role}`}
                className="border-border transition-colors hover:bg-muted"
              >
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/champions/${champ.championId}`}
                    className="flex items-center gap-3 hover:opacity-80"
                  >
                    <Image
                      src={championImageUrl(version, champ.championKey)}
                      alt={champ.championName}
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <div>
                      <span className="font-medium text-foreground">
                        {champ.championName}
                      </span>
                      {champ.gamesPlayed > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          {champ.role}
                        </span>
                      )}
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <TierBadge tier={champ.tier} />
                </TableCell>
                <TableCell
                  className={cn("text-right font-mono text-sm", winRateColor)}
                >
                  {champ.gamesPlayed > 0 ? `${champ.winRate.toFixed(1)}%` : "-"}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  {champ.gamesPlayed > 0
                    ? `${champ.pickRate.toFixed(1)}%`
                    : "-"}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground">
                  {champ.gamesPlayed > 0
                    ? `${champ.banRate.toFixed(1)}%`
                    : "-"}
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-foreground">
                  {champ.gamesPlayed > 0 ? champ.avgKDA.toFixed(2) : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
