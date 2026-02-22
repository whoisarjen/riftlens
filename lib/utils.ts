import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TIER_COLORS, QUEUE_TYPES } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWinRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return "0%";
  return `${((wins / total) * 100).toFixed(1)}%`;
}

export function formatKDA(k: number, d: number, a: number): string {
  if (d === 0) return "Perfect";
  return ((k + a) / d).toFixed(2);
}

export function formatGameDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function tierToColor(tier: string): string {
  return TIER_COLORS[tier.toUpperCase()] || "#A1A1AA";
}

export function queueName(queueId: number): string {
  return QUEUE_TYPES[queueId] || "Custom";
}

export function csPerMinute(cs: number, durationSeconds: number): string {
  if (durationSeconds === 0) return "0.0";
  return ((cs / durationSeconds) * 60).toFixed(1);
}

export function kdaColor(kda: number): string {
  if (kda >= 5) return "text-amber-400";
  if (kda >= 3) return "text-positive";
  if (kda >= 2) return "text-foreground";
  return "text-muted-foreground";
}
