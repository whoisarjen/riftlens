"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import type { ParticipantDetail } from "@/lib/types/internal";

interface DamageBreakdownChartProps {
  participants: ParticipantDetail[];
  version: string;
}

const PHYSICAL_COLOR = "#F97316";
const MAGIC_COLOR = "#3B82F6";
const TRUE_COLOR = "#FAFAFA";

export function DamageBreakdownChart({
  participants,
  version,
}: DamageBreakdownChartProps) {
  const sorted = [...participants].sort(
    (a, b) => b.totalDamage - a.totalDamage
  );

  const data = sorted.map((p) => ({
    name: p.championName,
    physical: p.physicalDamage,
    magic: p.magicDamage,
    true: p.trueDamage,
    total: p.totalDamage,
    teamId: p.teamId,
  }));

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-[#A1A1AA]">
        Damage to Champions
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" barCategoryGap={4}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#27272A"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fill: "#A1A1AA", fontSize: 12 }}
            axisLine={{ stroke: "#27272A" }}
            tickLine={{ stroke: "#27272A" }}
            tickFormatter={(value) => formatNumber(value)}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={({ x, y, payload }) => {
              const entry = data.find((d) => d.name === payload.value);
              const color =
                entry?.teamId === 100 ? "#3B82F6" : "#EF4444";
              return (
                <text
                  x={x}
                  y={y}
                  dy={4}
                  textAnchor="end"
                  fill={color}
                  fontSize={12}
                >
                  {payload.value}
                </text>
              );
            }}
            axisLine={{ stroke: "#27272A" }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181B",
              border: "1px solid #27272A",
              borderRadius: "8px",
              color: "#FAFAFA",
            }}
            formatter={(value, name) => {
              const labels: Record<string, string> = {
                physical: "Physical",
                magic: "Magic",
                true: "True",
              };
              return [
                `${formatNumber(Number(value))}`,
                labels[String(name)] || String(name),
              ];
            }}
            labelFormatter={(label) => {
              const entry = data.find((d) => d.name === label);
              return `${label} - Total: ${formatNumber(entry?.total ?? 0)}`;
            }}
          />
          <Legend
            formatter={(value: string) => {
              const labels: Record<string, string> = {
                physical: "Physical",
                magic: "Magic",
                true: "True",
              };
              return (
                <span style={{ color: "#A1A1AA", fontSize: 12 }}>
                  {labels[value] || value}
                </span>
              );
            }}
          />
          <Bar
            dataKey="physical"
            stackId="damage"
            fill={PHYSICAL_COLOR}
            radius={0}
          />
          <Bar
            dataKey="magic"
            stackId="damage"
            fill={MAGIC_COLOR}
            radius={0}
          />
          <Bar
            dataKey="true"
            stackId="damage"
            fill={TRUE_COLOR}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
