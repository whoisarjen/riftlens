import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatKDA, formatNumber } from "@/lib/utils";
import { championImageUrl, itemImageUrl } from "@/lib/riot/ddragon";
import type { MatchDetail, ParticipantDetail } from "@/lib/types/internal";

interface MatchScoreboardProps {
  match: MatchDetail;
  version: string;
  highlightPuuid?: string;
}

function DamageBar({
  damage,
  maxDamage,
}: {
  damage: number;
  maxDamage: number;
}) {
  const width = maxDamage > 0 ? (damage / maxDamage) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#27272A]">
        <div
          className="h-full rounded-full bg-[#F59E0B]"
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="font-mono text-xs text-[#A1A1AA]">
        {formatNumber(damage)}
      </span>
    </div>
  );
}

function ItemSlot({
  itemId,
  version,
}: {
  itemId: number;
  version: string;
}) {
  if (!itemId || itemId === 0) {
    return (
      <div className="h-6 w-6 rounded border border-[#27272A] bg-[#09090B]" />
    );
  }
  return (
    <Image
      src={itemImageUrl(version, itemId)}
      alt={`Item ${itemId}`}
      width={24}
      height={24}
      className="rounded border border-[#27272A]"
    />
  );
}

function TeamTable({
  teamId,
  teamLabel,
  teamColor,
  participants,
  version,
  maxDamage,
  highlightPuuid,
}: {
  teamId: number;
  teamLabel: string;
  teamColor: string;
  participants: ParticipantDetail[];
  version: string;
  maxDamage: number;
  highlightPuuid?: string;
}) {
  const teamParticipants = participants.filter((p) => p.teamId === teamId);
  const isWin = teamParticipants[0]?.win ?? false;

  return (
    <Card className="border-[#27272A] bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span style={{ color: teamColor }}>{teamLabel}</span>
          <span
            className={cn(
              "text-xs",
              isWin ? "text-[#22C55E]" : "text-[#EF4444]"
            )}
          >
            {isWin ? "Victory" : "Defeat"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-[#27272A] hover:bg-transparent">
              <TableHead className="w-[200px] text-xs text-[#A1A1AA]">
                Champion
              </TableHead>
              <TableHead className="text-xs text-[#A1A1AA]">KDA</TableHead>
              <TableHead className="text-xs text-[#A1A1AA]">Damage</TableHead>
              <TableHead className="text-xs text-[#A1A1AA]">CS</TableHead>
              <TableHead className="text-xs text-[#A1A1AA]">Vision</TableHead>
              <TableHead className="text-xs text-[#A1A1AA]">Gold</TableHead>
              <TableHead className="text-xs text-[#A1A1AA]">Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamParticipants.map((p) => {
              const isHighlighted = highlightPuuid === p.puuid;
              const kda = formatKDA(p.kills, p.deaths, p.assists);
              return (
                <TableRow
                  key={p.participantId}
                  className={cn(
                    "border-[#27272A] hover:bg-[#18181B]/80",
                    isHighlighted && "border-l-2 border-l-[#F59E0B] bg-[#F59E0B]/5"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Image
                        src={championImageUrl(version, p.championName)}
                        alt={p.championName}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {p.riotIdGameName || p.championName}
                        </div>
                        <div className="truncate text-xs text-[#A1A1AA]">
                          {p.championName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">
                      <span className="text-foreground">{p.kills}</span>
                      <span className="text-[#A1A1AA]">/</span>
                      <span className="text-[#EF4444]">{p.deaths}</span>
                      <span className="text-[#A1A1AA]">/</span>
                      <span className="text-foreground">{p.assists}</span>
                    </div>
                    <div className="font-mono text-xs text-[#A1A1AA]">
                      {kda}
                      {kda !== "Perfect" && " KDA"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DamageBar damage={p.totalDamage} maxDamage={maxDamage} />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{p.cs}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{p.visionScore}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {formatNumber(p.goldEarned)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {p.items.slice(0, 6).map((itemId, idx) => (
                        <ItemSlot
                          key={idx}
                          itemId={itemId}
                          version={version}
                        />
                      ))}
                      {/* Trinket slot */}
                      <div className="ml-1">
                        <ItemSlot
                          itemId={p.items[6] ?? 0}
                          version={version}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function MatchScoreboard({
  match,
  version,
  highlightPuuid,
}: MatchScoreboardProps) {
  const maxDamage = Math.max(
    ...match.participants.map((p) => p.totalDamage),
    1
  );

  return (
    <div className="space-y-4">
      <TeamTable
        teamId={100}
        teamLabel="Blue Team"
        teamColor="#3B82F6"
        participants={match.participants}
        version={version}
        maxDamage={maxDamage}
        highlightPuuid={highlightPuuid}
      />
      <TeamTable
        teamId={200}
        teamLabel="Red Team"
        teamColor="#EF4444"
        participants={match.participants}
        version={version}
        maxDamage={maxDamage}
        highlightPuuid={highlightPuuid}
      />
    </div>
  );
}
