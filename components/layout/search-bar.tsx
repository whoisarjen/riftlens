"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Parse "GameName#TAG" format
    const hashIndex = trimmed.lastIndexOf("#");
    if (hashIndex === -1 || hashIndex === 0 || hashIndex === trimmed.length - 1) {
      // No valid tag separator, search as-is
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      return;
    }

    const gameName = trimmed.slice(0, hashIndex);
    const tagLine = trimmed.slice(hashIndex + 1);

    // Read region from localStorage or default to na1
    const region =
      typeof window !== "undefined"
        ? localStorage.getItem("riftlens-region") || "na1"
        : "na1";

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
        placeholder="Search: GameName#TAG"
        className="pl-9 bg-secondary border-border"
      />
    </form>
  );
}
