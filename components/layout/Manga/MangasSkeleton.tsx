import { Skeleton } from "@/components/ui/skeleton";

type MangasSkeletonProps = {
  layout?: "grid" | "compact";
};

export function MangasSkeleton({ layout = "grid" }: MangasSkeletonProps) {
  const count = layout === "compact" ? 8 : 12;

  return (
    <div
      className={
        layout === "compact"
          ? "grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full"
          : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 w-full"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={
            layout === "compact"
              ? "flex items-start gap-3 rounded-lg border border-border/60 bg-card/30 p-3"
              : "w-full min-w-0 space-y-2"
          }
        >
          <div
            className={
              layout === "compact"
                ? "relative h-32 w-24 shrink-0 overflow-hidden rounded"
                : "relative aspect-2/3 w-full overflow-hidden rounded"
            }
          >
            <Skeleton className="h-full w-full" />
          </div>

          {layout === "compact" ? (
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />

              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>

              <div className="space-y-1.5">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            </div>
          ) : (
            <Skeleton className="h-4 w-4/5 mx-auto" />
          )}
        </div>
      ))}
    </div>
  );
}
