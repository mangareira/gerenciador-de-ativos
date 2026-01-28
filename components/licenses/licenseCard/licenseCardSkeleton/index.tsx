import { Skeleton } from "@/components/ui/skeleton"

export const LicenseCardSkeleton = () => {
  return (
    <div className="p-4 rounded-lg border bg-background">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
        <div className="w-24">
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-3/4 rounded-md" />
      </div>
    </div>
  )
}

export default LicenseCardSkeleton
