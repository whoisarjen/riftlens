"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGIONS } from "@/lib/constants";

const REGION_GROUPS = REGIONS.reduce(
  (acc, r) => {
    if (!acc[r.group]) acc[r.group] = [];
    acc[r.group].push(r);
    return acc;
  },
  {} as Record<string, typeof REGIONS[number][]>
);

export function RegionSelector() {
  const [region, setRegion] = useState("na1");

  useEffect(() => {
    const stored = localStorage.getItem("riftlens-region");
    if (stored) setRegion(stored);
  }, []);

  function handleChange(value: string) {
    setRegion(value);
    localStorage.setItem("riftlens-region", value);
  }

  return (
    <Select value={region} onValueChange={handleChange}>
      <SelectTrigger className="w-[110px] bg-secondary border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(REGION_GROUPS).map(([group, regions]) => (
          <SelectGroup key={group}>
            <SelectLabel className="text-muted-foreground">{group}</SelectLabel>
            {regions.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.id.toUpperCase()}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
