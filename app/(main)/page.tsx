"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Trophy, BarChart3, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGIONS } from "@/lib/constants";

const REGION_GROUPS = REGIONS.reduce(
  (acc, r) => {
    if (!acc[r.group]) acc[r.group] = [];
    acc[r.group].push(r);
    return acc;
  },
  {} as Record<string, (typeof REGIONS)[number][]>
);

const FEATURES = [
  {
    icon: User,
    title: "Player Analytics",
    description:
      "Track summoner stats, match history, and ranked progression",
  },
  {
    icon: Trophy,
    title: "Champion Insights",
    description:
      "Win rates, builds, runes, and matchup data for every champion",
  },
  {
    icon: BarChart3,
    title: "Match Analysis",
    description:
      "Gold graphs, damage breakdowns, ward maps, and timeline events",
  },
] as const;

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("na1");

  useEffect(() => {
    const stored = localStorage.getItem("riftlens-region");
    if (stored) setRegion(stored);
  }, []);

  function handleRegionChange(value: string) {
    setRegion(value);
    localStorage.setItem("riftlens-region", value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const hashIndex = trimmed.lastIndexOf("#");
    if (
      hashIndex === -1 ||
      hashIndex === 0 ||
      hashIndex === trimmed.length - 1
    ) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      return;
    }

    const gameName = trimmed.slice(0, hashIndex);
    const tagLine = trimmed.slice(hashIndex + 1);

    router.push(
      `/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
    setQuery("");
  }

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative flex w-full flex-col items-center justify-center px-4 py-24 md:py-36">
        {/* Gradient background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-[300px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative mb-6 flex items-center gap-3">
          <Eye className="h-10 w-10 text-primary md:h-12 md:w-12" />
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Rift<span className="text-primary">lens</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="mb-12 text-lg text-muted-foreground md:text-xl">
          Deep vision into the Rift
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row"
        >
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="GameName#TAG"
              className="h-12 pl-12 text-base bg-card border-border"
            />
          </div>

          <Select value={region} onValueChange={handleRegionChange}>
            <SelectTrigger className="h-12 w-full sm:w-[130px] bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(REGION_GROUPS).map(([group, regions]) => (
                <SelectGroup key={group}>
                  <SelectLabel className="text-muted-foreground">
                    {group}
                  </SelectLabel>
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.id.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" className="h-12 w-full px-8 sm:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>

        {/* Helper text */}
        <p className="mt-4 text-sm text-muted-foreground">
          Enter a Riot ID to get started (e.g., Faker#KR1)
        </p>
      </section>

      {/* Feature cards */}
      <section className="w-full max-w-5xl px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/50 bg-card/80 backdrop-blur-sm transition-colors hover:border-primary/30"
            >
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
