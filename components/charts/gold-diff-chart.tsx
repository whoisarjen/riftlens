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
      <div className="flex h-[300px] items-center justify-center text-[#8B83A3]">
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
      <h3 className="mb-3 text-sm font-medium text-[#8B83A3]">
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
            stroke="#2D2A3A"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "#8B83A3", fontSize: 12 }}
            axisLine={{ stroke: "#2D2A3A" }}
            tickLine={{ stroke: "#2D2A3A" }}
            tickFormatter={(value) => `${value}m`}
          />
          <YAxis
            tick={{ fill: "#8B83A3", fontSize: 12 }}
            axisLine={{ stroke: "#2D2A3A" }}
            tickLine={{ stroke: "#2D2A3A" }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1825",
              border: "1px solid #2D2A3A",
              borderRadius: "8px",
              color: "#F5F3FF",
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
            stroke="#D4A843"
            strokeWidth={2}
            fill="url(#goldDiffGradient)"
            baseLine={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
