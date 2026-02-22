"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Sword, Flame, Crown, Building } from "lucide-react";
import type { TimelineData, TimelineEventData } from "@/lib/types/internal";

interface MatchTimelineProps {
  timeline: TimelineData | null;
}

type EventFilter = "all" | "CHAMPION_KILL" | "ELITE_MONSTER_KILL" | "BUILDING_KILL";

const FILTER_OPTIONS: { value: EventFilter; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All", icon: null },
  {
    value: "CHAMPION_KILL",
    label: "Kills",
    icon: <Sword className="h-3.5 w-3.5" />,
  },
  {
    value: "ELITE_MONSTER_KILL",
    label: "Objectives",
    icon: <Flame className="h-3.5 w-3.5" />,
  },
  {
    value: "BUILDING_KILL",
    label: "Structures",
    icon: <Building className="h-3.5 w-3.5" />,
  },
];

function formatTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getEventIcon(event: TimelineEventData): React.ReactNode {
  switch (event.type) {
    case "CHAMPION_KILL":
      return <Sword className="h-4 w-4" />;
    case "ELITE_MONSTER_KILL":
      if (event.monsterType === "BARON_NASHOR") {
        return <Crown className="h-4 w-4" />;
      }
      return <Flame className="h-4 w-4" />;
    case "BUILDING_KILL":
      return <Building className="h-4 w-4" />;
    default:
      return null;
  }
}

function getEventDescription(event: TimelineEventData): string {
  switch (event.type) {
    case "CHAMPION_KILL": {
      const killer = event.killerId
        ? `Player ${event.killerId}`
        : "Minions/Turret";
      const victim = event.victimId ? `Player ${event.victimId}` : "Unknown";
      return `${killer} killed ${victim}`;
    }
    case "ELITE_MONSTER_KILL": {
      const monsterNames: Record<string, string> = {
        DRAGON: "Dragon",
        BARON_NASHOR: "Baron Nashor",
        RIFTHERALD: "Rift Herald",
        ELDER_DRAGON: "Elder Dragon",
        HORDE: "Void Grubs",
      };
      const name = monsterNames[event.monsterType ?? ""] ?? event.monsterType ?? "Monster";
      const killer = event.killerId ? `Player ${event.killerId}` : "Unknown";
      return `${killer} slew ${name}`;
    }
    case "BUILDING_KILL": {
      const buildingNames: Record<string, string> = {
        TOWER_BUILDING: "Tower",
        INHIBITOR_BUILDING: "Inhibitor",
        NEXUS_BUILDING: "Nexus",
      };
      const name = buildingNames[event.buildingType ?? ""] ?? "Structure";
      return `${name} destroyed`;
    }
    default:
      return event.type;
  }
}

function getEventTeamColor(event: TimelineEventData): string {
  // For kills, killer's team determines color
  if (event.type === "CHAMPION_KILL") {
    if (event.killerId && event.killerId <= 5) return "#3B82F6";
    if (event.killerId && event.killerId > 5) return "#EF4444";
  }
  // For objectives and buildings, use teamId
  if (event.teamId === 100) return "#3B82F6";
  if (event.teamId === 200) return "#EF4444";
  return "#8B83A3";
}

export function MatchTimeline({ timeline }: MatchTimelineProps) {
  const [filter, setFilter] = useState<EventFilter>("all");

  const events = useMemo(() => {
    if (!timeline) return [];
    const allEvents: TimelineEventData[] = [];
    for (const frame of timeline.frames) {
      for (const event of frame.events) {
        if (
          event.type === "CHAMPION_KILL" ||
          event.type === "ELITE_MONSTER_KILL" ||
          event.type === "BUILDING_KILL"
        ) {
          allEvents.push(event);
        }
      }
    }
    return allEvents.sort((a, b) => a.timestamp - b.timestamp);
  }, [timeline]);

  const filteredEvents = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.type === filter);
  }, [events, filter]);

  if (!timeline) {
    return (
      <div className="flex h-[300px] items-center justify-center text-[#8B83A3]">
        Timeline data not available
      </div>
    );
  }

  return (
    <div>
      {/* Filter buttons */}
      <div className="mb-4 flex gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              filter === opt.value
                ? "bg-[#D4A843]/20 text-[#D4A843]"
                : "bg-[#2D2A3A]/50 text-[#8B83A3] hover:text-foreground"
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="max-h-[500px] space-y-1 overflow-y-auto pr-2">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-sm text-[#8B83A3]">
            No events to display
          </div>
        ) : (
          filteredEvents.map((event, idx) => {
            const color = getEventTeamColor(event);
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-[#2D2A3A]/30"
              >
                <span className="w-12 shrink-0 font-mono text-xs text-[#8B83A3]">
                  {formatTimestamp(event.timestamp)}
                </span>
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${color}20`,
                    color,
                  }}
                >
                  {getEventIcon(event)}
                </div>
                <span className="text-sm text-foreground">
                  {getEventDescription(event)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
