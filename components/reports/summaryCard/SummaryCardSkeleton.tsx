import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const SummaryCardSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <Card key={idx}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32 rounded-md" />
              </div>
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCardSkeleton;
