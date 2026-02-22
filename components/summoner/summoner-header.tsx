import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { profileIconUrl } from "@/lib/riot/ddragon";
import type { SummonerProfile } from "@/lib/types/internal";
import { REGIONS } from "@/lib/constants";

interface SummonerHeaderProps {
  profile: SummonerProfile;
  version: string;
}

export function SummonerHeader({ profile, version }: SummonerHeaderProps) {
  const regionInfo = REGIONS.find((r) => r.id === profile.region);
  const regionDisplay = regionInfo
    ? regionInfo.id.toUpperCase()
    : profile.region.toUpperCase();
  const isHighLevel = profile.summonerLevel >= 200;

  return (
    <div className="flex items-center gap-5">
      {/* Profile icon */}
      <div className="relative shrink-0">
        <div
          className={`overflow-hidden rounded-full border-2 ${
            isHighLevel ? "border-primary" : "border-border"
          }`}
        >
          <Image
            src={profileIconUrl(version, profile.profileIconId)}
            alt={`${profile.gameName} profile icon`}
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        {/* Level badge */}
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-card border border-border px-2 py-0.5 text-xs font-mono font-medium text-foreground">
          {profile.summonerLevel}
        </span>
      </div>

      {/* Name and info */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            <span className="text-foreground">{profile.gameName}</span>
            <span className="text-muted-foreground">
              #{profile.tagLine}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {regionDisplay}
          </Badge>
        </div>
      </div>
    </div>
  );
}
