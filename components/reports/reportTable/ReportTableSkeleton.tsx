import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function ReportTableSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="ativos" className="w-full">
        <TabsList>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="licencas">Licenças</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="chamados">Chamados</TabsTrigger>
        </TabsList>

        <TabsContent value="ativos" className="space-y-6 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full rounded-md" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <Skeleton className="h-48 w-48 rounded-full" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-72 w-full rounded-md" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>

                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                    <Skeleton className="h-6 w-16 rounded-full ml-auto" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}