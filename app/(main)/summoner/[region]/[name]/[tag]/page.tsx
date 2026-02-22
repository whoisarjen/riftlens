import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SummonerHeader } from "@/components/summoner/summoner-header";
import { RankedInfo } from "@/components/summoner/ranked-info";
import { MatchHistory } from "@/components/summoner/match-history";
import { getLatestVersion } from "@/lib/riot/ddragon";
import type { SummonerProfile, MatchSummary } from "@/lib/types/internal";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

interface PageProps {
  params: Promise<{
    region: string;
    name: string;
    tag: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, name, tag } = await params;
  const decodedName = decodeURIComponent(name);
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedName}#${decodedTag} (${region.toUpperCase()})`,
    description: `Player profile and match history for ${decodedName}#${decodedTag} on ${region.toUpperCase()} — Riftlens`,
  };
}

async function fetchSummonerProfile(
  region: string,
  name: string,
  tag: string
): Promise<SummonerProfile | null> {
  try {
    const res = await fetch(
      `${getBaseUrl()}/api/summoner/${region}/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchMatches(
  region: string,
  puuid: string
): Promise<MatchSummary[]> {
  try {
    const res = await fetch(
      `${getBaseUrl()}/api/summoner/${region}/by-puuid/${puuid}/matches`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SummonerPage({ params }: PageProps) {
  const { region, name, tag } = await params;
  const decodedName = decodeURIComponent(name);
  const decodedTag = decodeURIComponent(tag);

  const [profile, version] = await Promise.all([
    fetchSummonerProfile(region, decodedName, decodedTag),
    getLatestVersion(),
  ]);

  if (!profile) {
    notFound();
  }

  const matches = await fetchMatches(region, profile.puuid);

  return (
    <div className="flex flex-col gap-6">
      {/* Player header */}
      <SummonerHeader profile={profile} version={version} />

      {/* Ranked info */}
      <RankedInfo soloRank={profile.soloRank} flexRank={profile.flexRank} />

      {/* Match history */}
      <MatchHistory matches={matches} version={version} />
    </div>
  );
}
