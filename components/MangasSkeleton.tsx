import { Skeleton } from "@/components/ui/skeleton";

export function MangasSkeleton() {
  return (
    <div className="flex flex-wrap gap-6 mt-8 justify-center">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-56 space-y-2">
          <Skeleton className="w-full aspect-2/3 rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>
      ))}
    </div>
  );
}
