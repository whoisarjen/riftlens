"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TIER_ORDER } from "@/lib/constants";
import { Search } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "ALL", label: "All Roles" },
  { value: "TOP", label: "Top" },
  { value: "JUNGLE", label: "Jungle" },
  { value: "MID", label: "Mid" },
  { value: "ADC", label: "ADC" },
  { value: "SUPPORT", label: "Support" },
] as const;

interface ChampionFiltersProps {
  onSearchChange?: (search: string) => void;
}

export function ChampionFilters({ onSearchChange }: ChampionFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentRole = searchParams.get("role") || "ALL";
  const currentTier = searchParams.get("tier") || "ALL";
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  const updateParams = useCallback(
    (key: string, value: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "ALL" || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
      });
    },
    [router, pathname, searchParams, startTransition]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearchChange?.(value);
      updateParams("search", value);
    },
    [onSearchChange, updateParams]
  );

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Role toggle buttons */}
      <div className="flex flex-wrap gap-1.5">
        {ROLE_OPTIONS.map((role) => (
          <button
            key={role.value}
            onClick={() => updateParams("role", role.value)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              currentRole === role.value
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
            )}
          >
            {role.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {/* Tier dropdown */}
        <Select
          value={currentTier}
          onValueChange={(value) => updateParams("tier", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Tiers</SelectItem>
            {TIER_ORDER.map((tier) => (
              <SelectItem key={tier} value={tier}>
                {tier.charAt(0) + tier.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search champion..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-[180px] pl-8"
          />
        </div>
      </div>
    </div>
  );
}
