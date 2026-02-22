import Link from "next/link";
import { Eye } from "lucide-react";
import { SearchBar } from "./search-bar";
import { RegionSelector } from "./region-selector";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Eye className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">
            Rift<span className="text-primary">lens</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="/champions"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Champions
          </Link>
        </nav>

        {/* Search + Region */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <SearchBar />
          <RegionSelector />
        </div>
      </div>
    </header>
  );
}
