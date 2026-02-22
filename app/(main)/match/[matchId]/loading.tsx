import { Skeleton } from "@/components/ui/skeleton";

export default function MatchLoading() {
  return (
    <div className="space-y-6">
      {/* Match Header Skeleton */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex items-center justify-between gap-8">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-24" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
          <Skeleton className="h-10 w-16" />
          <div className="flex-1 space-y-2">
            <Skeleton className="ml-auto h-8 w-24" />
            <div className="flex justify-end gap-4">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Scoreboard Skeleton */}
      <div className="rounded-xl border border-border bg-card p-6">
        <Skeleton className="mb-4 h-6 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <div className="flex gap-1">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-6 w-6" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Team Skeleton */}
      <div className="rounded-xl border border-border bg-card p-6">
        <Skeleton className="mb-4 h-6 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <div className="flex gap-1">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-6 w-6" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Skeleton */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  );
}
