"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import type { TimelineData, ParticipantDetail } from "@/lib/types/internal";

interface GoldGraphChartProps {
  timeline: TimelineData | null;
  participants: ParticipantDetail[];
}

const BLUE_SHADES = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#2563EB"];
const RED_SHADES = ["#EF4444", "#F87171", "#FCA5A5", "#FECACA", "#DC2626"];

export function GoldGraphChart({
  timeline,
  participants,
}: GoldGraphChartProps) {
  if (!timeline) {
    return (
      <div className="flex h-[400px] items-center justify-center text-[#8B83A3]">
        Timeline data not available
      </div>
    );
  }

  // Build participant lookup: participantId -> championName
  const participantMap = new Map<number, { name: string; teamId: number }>();
  participants.forEach((p) => {
    participantMap.set(p.participantId, {
      name: p.championName,
      teamId: p.teamId,
    });
  });

  // Build chart data
  const data = timeline.frames.map((frame) => {
    const point: Record<string, number | string> = {
      time: Math.round(frame.timestamp / 60000),
    };
    for (const [pidStr, pData] of Object.entries(frame.participants)) {
      const pid = parseInt(pidStr, 10);
      const info = participantMap.get(pid);
      if (info) {
        point[info.name] = pData.gold;
      }
    }
    return point;
  });

  // Build lines: blue team participants first, then red
  const blueParticipants = participants
    .filter((p) => p.teamId === 100)
    .sort((a, b) => a.participantId - b.participantId);
  const redParticipants = participants
    .filter((p) => p.teamId === 200)
    .sort((a, b) => a.participantId - b.participantId);

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-[#8B83A3]">
        Gold Over Time (per Player)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
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
              maxHeight: "300px",
              overflowY: "auto",
            }}
            labelFormatter={(value) => `${value} min`}
            formatter={(value, name) => [
              formatNumber(Number(value)),
              String(name),
            ]}
          />
          <Legend
            formatter={(value: string) => (
              <span style={{ color: "#8B83A3", fontSize: 11 }}>{value}</span>
            )}
          />
          {blueParticipants.map((p, i) => (
            <Line
              key={p.participantId}
              type="monotone"
              dataKey={p.championName}
              stroke={BLUE_SHADES[i % BLUE_SHADES.length]}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />
          ))}
          {redParticipants.map((p, i) => (
            <Line
              key={p.participantId}
              type="monotone"
              dataKey={p.championName}
              stroke={RED_SHADES[i % RED_SHADES.length]}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
