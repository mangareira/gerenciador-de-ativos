import { Card, CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

export default function AssetsSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Skeleton className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16 mt-2" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">ID:</span>
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Serial:</span>
            <Skeleton className="h-4 w-12" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Skeleton className="h-4 w-12" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usuário:</span>
            <Skeleton className="h-4 w-12" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Departamento:</span>
            <Skeleton className="h-4 w-8" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Local:</span>
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center justify-between text-sm pt-2 border-t">
            <span className="text-muted-foreground">Valor Atual:</span>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}