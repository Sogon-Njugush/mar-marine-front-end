import { Skeleton } from "@/components/ui/skeleton";

export default function UnitsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-[250px]" /> {/* Search bar input */}
        <Skeleton className="h-4 w-[100px]" /> {/* Count label */}
      </div>
      <div className="rounded-md border p-4">
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" /> {/* Header */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-12 w-[100px]" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Skeleton className="h-9 w-[100px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>
    </div>
  );
}
