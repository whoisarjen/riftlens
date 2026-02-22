import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function SummonerLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex items-center gap-5">
        {/* Profile icon */}
        <Skeleton className="h-20 w-20 rounded-full" />

        {/* Name and badges */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        </div>
      </div>

      {/* Ranked cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-0">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Match history skeleton */}
      <div>
        <Skeleton className="mb-4 h-6 w-32" />

        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-4"
            >
              {/* Champion icon */}
              <Skeleton className="h-12 w-12 shrink-0 rounded-full" />

              {/* Details */}
              <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-6">
                <div className="flex flex-col gap-1 md:w-28">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-3 w-12" />
                </div>

                <div className="flex flex-col gap-1 md:w-28">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>

                <div className="flex flex-col gap-1 md:w-24">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>

                {/* Items */}
                <div className="flex gap-0.5">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Skeleton key={j} className="h-7 w-7 rounded" />
                  ))}
                </div>
              </div>

              {/* Time ago */}
              <Skeleton className="h-3 w-12 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
