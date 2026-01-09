import { Skeleton } from "@/components/ui/skeleton";

export function MangasSkeleton() {
  return (
    <div className="flex flex-wrap gap-6 mt-8 justify-center md:max-w-2/3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="w-56 space-y-2">
          <Skeleton className="w-full aspect-2/3 rounded-lg bg-gray-300" />
          <Skeleton className="h-4 w-full bg-gray-300" />
          <Skeleton className="h-4 w-2/3 mx-auto bg-gray-300" />
        </div>
      ))}
    </div>
  );
}
