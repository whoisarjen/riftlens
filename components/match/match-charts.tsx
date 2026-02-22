"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { GoldDiffChart } from "@/components/charts/gold-diff-chart";
import { DamageBreakdownChart } from "@/components/charts/damage-breakdown-chart";
import { GoldGraphChart } from "@/components/charts/gold-graph-chart";
import { MatchTimeline } from "@/components/match/match-timeline";
import { WardMap } from "@/components/match/ward-map";
import type { MatchDetail } from "@/lib/types/internal";

interface MatchChartsProps {
  match: MatchDetail;
  version: string;
}

export function MatchCharts({ match, version }: MatchChartsProps) {
  return (
    <Card className="border-[#27272A] bg-card">
      <CardContent className="p-6">
        <Tabs defaultValue="gold">
          <TabsList className="mb-4">
            <TabsTrigger value="gold">Gold</TabsTrigger>
            <TabsTrigger value="damage">Damage</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="gold-graph">Gold Graph</TabsTrigger>
            <TabsTrigger value="wards">Wards</TabsTrigger>
          </TabsList>

          <TabsContent value="gold">
            <GoldDiffChart timeline={match.timeline} />
          </TabsContent>

          <TabsContent value="damage">
            <DamageBreakdownChart
              participants={match.participants}
              version={version}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <MatchTimeline timeline={match.timeline} />
          </TabsContent>

          <TabsContent value="gold-graph">
            <GoldGraphChart
              timeline={match.timeline}
              participants={match.participants}
            />
          </TabsContent>

          <TabsContent value="wards">
            <WardMap timeline={match.timeline} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
