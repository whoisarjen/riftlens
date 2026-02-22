"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import type { TimelineData } from "@/lib/types/internal";

interface GoldDiffChartProps {
  timeline: TimelineData | null;
}

export function GoldDiffChart({ timeline }: GoldDiffChartProps) {
  if (!timeline) {
    return (
      <div className="flex h-[300px] items-center justify-center text-[#A1A1AA]">
        Timeline data not available
      </div>
    );
  }

  const data = timeline.frames.map((frame) => {
    const minutes = Math.round(frame.timestamp / 60000);
    const goldDiff = frame.blueTeamGold - frame.redTeamGold;
    return {
      time: minutes,
      goldDiff,
      positive: goldDiff >= 0 ? goldDiff : 0,
      negative: goldDiff < 0 ? goldDiff : 0,
    };
  });

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-[#A1A1AA]">
        Gold Difference (Blue - Red)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="goldDiffGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity={0} />
              <stop offset="50%" stopColor="#EF4444" stopOpacity={0} />
              <stop offset="100%" stopColor="#EF4444" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272A"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "#A1A1AA", fontSize: 12 }}
            axisLine={{ stroke: "#27272A" }}
            tickLine={{ stroke: "#27272A" }}
            tickFormatter={(value) => `${value}m`}
          />
          <YAxis
            tick={{ fill: "#A1A1AA", fontSize: 12 }}
            axisLine={{ stroke: "#27272A" }}
            tickLine={{ stroke: "#27272A" }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181B",
              border: "1px solid #27272A",
              borderRadius: "8px",
              color: "#FAFAFA",
            }}
            labelFormatter={(value) => `${value} min`}
            formatter={(value) => {
              const num = Number(value);
              const label = num >= 0 ? "Blue ahead" : "Red ahead";
              return [`${formatNumber(Math.abs(num))} gold`, label];
            }}
          />
          <Area
            type="monotone"
            dataKey="goldDiff"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="url(#goldDiffGradient)"
            baseLine={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
