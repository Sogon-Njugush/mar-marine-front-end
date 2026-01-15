import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search Bar Skeleton */}
      <Skeleton className="h-10 w-[300px]" />

      {/* Table Header Skeleton */}
      <div className="rounded-md border">
        <div className="h-12 border-b bg-muted/50 px-4 flex items-center">
          <Skeleton className="h-4 w-[100px]" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between space-x-4"
            >
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
