import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  // If the query contains a #, try to redirect to the summoner page
  if (q && q.includes("#")) {
    const hashIndex = q.lastIndexOf("#");
    const gameName = q.slice(0, hashIndex).trim();
    const tagLine = q.slice(hashIndex + 1).trim();

    if (gameName && tagLine) {
      // Default to NA1 since we don't have region context in search params
      redirect(
        `/summoner/na1/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>

        {q ? (
          <>
            <h1 className="text-2xl font-bold">
              Search for:{" "}
              <span className="text-primary">&ldquo;{q}&rdquo;</span>
            </h1>
            <p className="max-w-md text-muted-foreground">
              To look up a player, use the Riot ID format:{" "}
              <span className="font-mono text-foreground">GameName#TAG</span>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Search</h1>
            <p className="max-w-md text-muted-foreground">
              Enter a Riot ID in the search bar above to look up a player.
            </p>
          </>
        )}
      </div>

      <Card className="w-full max-w-md border-border/50">
        <CardContent>
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-muted-foreground">
              Search Tips
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  Use the format{" "}
                  <span className="font-mono text-foreground">
                    GameName#TAG
                  </span>{" "}
                  (e.g.,{" "}
                  <span className="font-mono text-foreground">Faker#KR1</span>
                  )
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  Make sure to select the correct region before searching
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  The tag is case-insensitive, but the game name must match
                  exactly
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
