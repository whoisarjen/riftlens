"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { REGIONS } from "@/lib/constants";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const region =
      typeof window !== "undefined"
        ? localStorage.getItem("riftlens-region") || "na1"
        : "na1";

    const hashIndex = trimmed.lastIndexOf("#");

    let gameName: string;
    let tagLine: string;

    if (hashIndex > 0 && hashIndex < trimmed.length - 1) {
      gameName = trimmed.slice(0, hashIndex);
      tagLine = trimmed.slice(hashIndex + 1);
    } else {
      // No tag — use region's default tag
      gameName = hashIndex === trimmed.length - 1 ? trimmed.slice(0, -1) : trimmed;
      const regionData = REGIONS.find((r) => r.id === region);
      tagLine = regionData?.defaultTag ?? region.toUpperCase();
    }

    router.push(
      `/summoner/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
    setQuery("");
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search summoner..."
        className="pl-9 bg-secondary border-border"
      />
    </form>
  );
}
