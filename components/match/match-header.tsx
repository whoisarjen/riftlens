import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  formatGameDuration,
  formatTimeAgo,
  queueName,
  formatNumber,
} from "@/lib/utils";
import type { MatchDetail, TeamDetail } from "@/lib/types/internal";
import { Flame, Crown, Building, Swords, Shield } from "lucide-react";

interface MatchHeaderProps {
  match: MatchDetail;
  version: string;
}

function TeamObjectives({ team }: { team: TeamDetail }) {
  return (
    <div className="flex items-center gap-3 text-sm text-[#A1A1AA]">
      <div className="flex items-center gap-1" title="Dragons">
        <Flame className="h-4 w-4" />
        <span className="font-mono">{team.dragons}</span>
      </div>
      <div className="flex items-center gap-1" title="Barons">
        <Crown className="h-4 w-4" />
        <span className="font-mono">{team.barons}</span>
      </div>
      <div className="flex items-center gap-1" title="Towers">
        <Building className="h-4 w-4" />
        <span className="font-mono">{team.towers}</span>
      </div>
      <div className="flex items-center gap-1" title="Inhibitors">
        <Shield className="h-4 w-4" />
        <span className="font-mono">{team.inhibitors}</span>
      </div>
    </div>
  );
}

export function MatchHeader({ match, version }: MatchHeaderProps) {
  const blueTeam = match.teams.find((t) => t.teamId === 100);
  const redTeam = match.teams.find((t) => t.teamId === 200);

  const patchVersion = match.gameVersion.split(".").slice(0, 2).join(".");

  return (
    <Card className="border-[#27272A] bg-card">
      <CardContent className="p-6">
        {/* Top info bar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="border-[#F59E0B] text-[#F59E0B]"
          >
            {queueName(match.queueId)}
          </Badge>
          <span className="font-mono text-sm text-[#A1A1AA]">
            {formatGameDuration(match.gameDuration)}
          </span>
          <span className="text-sm text-[#A1A1AA]">
            Patch {patchVersion}
          </span>
          <span className="text-sm text-[#A1A1AA]">
            {formatTimeAgo(match.gameStartTimestamp)}
          </span>
        </div>

        <Separator className="mb-6 bg-[#27272A]" />

        {/* Team comparison */}
        <div className="flex items-center gap-4">
          {/* Blue Team */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#3B82F6]">
                Blue Side
              </span>
              {blueTeam?.win ? (
                <Badge className="bg-[#22C55E]/20 text-[#22C55E]">
                  Victory
                </Badge>
              ) : (
                <Badge className="bg-[#EF4444]/20 text-[#EF4444]">
                  Defeat
                </Badge>
              )}
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold text-[#3B82F6]">
                {blueTeam?.totalKills ?? 0}
              </span>
              <span className="text-sm text-[#A1A1AA]">Kills</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-[#A1A1AA]">
              <Swords className="h-3.5 w-3.5" />
              <span className="font-mono">
                {formatNumber(blueTeam?.totalGold ?? 0)}
              </span>
              <span>Gold</span>
            </div>
            {blueTeam && (
              <div className="mt-2">
                <TeamObjectives team={blueTeam} />
              </div>
            )}
          </div>

          {/* VS divider */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold text-[#A1A1AA]">VS</span>
          </div>

          {/* Red Team */}
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-3">
              {redTeam?.win ? (
                <Badge className="bg-[#22C55E]/20 text-[#22C55E]">
                  Victory
                </Badge>
              ) : (
                <Badge className="bg-[#EF4444]/20 text-[#EF4444]">
                  Defeat
                </Badge>
              )}
              <span className="text-sm font-medium text-[#EF4444]">
                Red Side
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-end gap-3">
              <span className="text-sm text-[#A1A1AA]">Kills</span>
              <span className="font-mono text-3xl font-bold text-[#EF4444]">
                {redTeam?.totalKills ?? 0}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-end gap-2 text-sm text-[#A1A1AA]">
              <span>Gold</span>
              <span className="font-mono">
                {formatNumber(redTeam?.totalGold ?? 0)}
              </span>
              <Swords className="h-3.5 w-3.5" />
            </div>
            {redTeam && (
              <div className="mt-2 flex justify-end">
                <TeamObjectives team={redTeam} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
