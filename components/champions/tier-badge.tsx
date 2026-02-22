import { cn } from "@/lib/utils";

const TIER_STYLES: Record<string, string> = {
  S: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
  A: "bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30",
  B: "bg-[#6366F1]/20 text-[#6366F1] border-[#6366F1]/30",
  C: "bg-[#64748B]/20 text-[#A1A1AA] border-[#64748B]/30",
  D: "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30",
};

interface TierBadgeProps {
  tier: "S" | "A" | "B" | "C" | "D";
  className?: string;
}

export function TierBadge({ tier, className }: TierBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded border text-xs font-bold",
        TIER_STYLES[tier] ?? TIER_STYLES.C,
        className
      )}
    >
      {tier}
    </span>
  );
}
