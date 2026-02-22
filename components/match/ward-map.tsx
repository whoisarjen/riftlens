"use client";

import { useMemo } from "react";
import type { TimelineData, TimelineEventData } from "@/lib/types/internal";

interface WardMapProps {
  timeline: TimelineData | null;
}

// Summoner's Rift game coordinate bounds
const MAP_WIDTH = 14870;
const MAP_HEIGHT = 14980;
const SVG_SIZE = 400;

function gameToSvg(x: number, y: number): { cx: number; cy: number } {
  return {
    cx: (x / MAP_WIDTH) * SVG_SIZE,
    // Y axis is flipped: high game Y = top of map = low SVG Y
    cy: SVG_SIZE - (y / MAP_HEIGHT) * SVG_SIZE,
  };
}

function getWardTeam(event: TimelineEventData): number | null {
  // creatorId is on the raw event but mapped to killerId in our transform
  // For WARD_PLACED, killerId is the placer
  if (event.killerId) {
    return event.killerId <= 5 ? 100 : 200;
  }
  return event.teamId ?? null;
}

export function WardMap({ timeline }: WardMapProps) {
  const wards = useMemo(() => {
    if (!timeline) return [];
    const wardEvents: (TimelineEventData & { team: number })[] = [];
    for (const frame of timeline.frames) {
      for (const event of frame.events) {
        if (event.type === "WARD_PLACED" && event.position) {
          const team = getWardTeam(event);
          if (team) {
            wardEvents.push({ ...event, team });
          }
        }
      }
    }
    return wardEvents;
  }, [timeline]);

  if (!timeline) {
    return (
      <div className="flex h-[400px] items-center justify-center text-[#A1A1AA]">
        Ward data not available
      </div>
    );
  }

  if (wards.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center text-[#A1A1AA]">
        No ward placement data found
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-[#A1A1AA]">
        Ward Placements
      </h3>
      <div className="flex items-start gap-6">
        <div className="relative">
          <svg
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="rounded-lg border border-[#27272A]"
          >
            {/* Map background */}
            <rect
              width={SVG_SIZE}
              height={SVG_SIZE}
              fill="#09090B"
              rx={8}
            />

            {/* Grid lines for orientation */}
            {[1, 2, 3].map((i) => (
              <g key={i}>
                <line
                  x1={(SVG_SIZE / 4) * i}
                  y1={0}
                  x2={(SVG_SIZE / 4) * i}
                  y2={SVG_SIZE}
                  stroke="#27272A"
                  strokeWidth={0.5}
                />
                <line
                  x1={0}
                  y1={(SVG_SIZE / 4) * i}
                  x2={SVG_SIZE}
                  y2={(SVG_SIZE / 4) * i}
                  stroke="#27272A"
                  strokeWidth={0.5}
                />
              </g>
            ))}

            {/* Diagonal lane indicators */}
            <line
              x1={0}
              y1={SVG_SIZE}
              x2={SVG_SIZE}
              y2={0}
              stroke="#27272A"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />

            {/* Blue base indicator (bottom-left) */}
            <rect
              x={2}
              y={SVG_SIZE - 22}
              width={20}
              height={20}
              fill="#3B82F6"
              fillOpacity={0.15}
              rx={4}
            />
            <text
              x={12}
              y={SVG_SIZE - 8}
              textAnchor="middle"
              fill="#3B82F6"
              fontSize={8}
              fontWeight="bold"
            >
              B
            </text>

            {/* Red base indicator (top-right) */}
            <rect
              x={SVG_SIZE - 22}
              y={2}
              width={20}
              height={20}
              fill="#EF4444"
              fillOpacity={0.15}
              rx={4}
            />
            <text
              x={SVG_SIZE - 12}
              y={16}
              textAnchor="middle"
              fill="#EF4444"
              fontSize={8}
              fontWeight="bold"
            >
              R
            </text>

            {/* Ward dots */}
            {wards.map((ward, idx) => {
              if (!ward.position) return null;
              const { cx, cy } = gameToSvg(ward.position.x, ward.position.y);
              const isControlWard = ward.wardType === "CONTROL_WARD";
              const color = ward.team === 100 ? "#3B82F6" : "#EF4444";
              const radius = isControlWard ? 4 : 2.5;

              return (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={color}
                  fillOpacity={0.7}
                  stroke={color}
                  strokeWidth={isControlWard ? 1 : 0.5}
                  strokeOpacity={0.9}
                />
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-medium text-[#A1A1AA]">Legend</div>
          <div className="flex items-center gap-2">
            <svg width={12} height={12}>
              <circle cx={6} cy={6} r={3} fill="#3B82F6" />
            </svg>
            <span className="text-xs text-[#A1A1AA]">Blue Team Ward</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width={12} height={12}>
              <circle cx={6} cy={6} r={3} fill="#EF4444" />
            </svg>
            <span className="text-xs text-[#A1A1AA]">Red Team Ward</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width={16} height={16}>
              <circle
                cx={8}
                cy={8}
                r={4.5}
                fill="#A1A1AA"
                stroke="#A1A1AA"
                strokeWidth={1}
              />
            </svg>
            <span className="text-xs text-[#A1A1AA]">Control Ward (larger)</span>
          </div>
          <div className="mt-4 border-t border-[#27272A] pt-3">
            <div className="font-mono text-xs text-[#A1A1AA]">
              Total: {wards.length} wards
            </div>
            <div className="font-mono text-xs text-[#3B82F6]">
              Blue: {wards.filter((w) => w.team === 100).length}
            </div>
            <div className="font-mono text-xs text-[#EF4444]">
              Red: {wards.filter((w) => w.team === 200).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
