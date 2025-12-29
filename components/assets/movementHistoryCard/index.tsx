import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Asset } from "@/utils/schemas/assets.schemas"

const MovementHistoryCard = ({asset}: {asset: Asset}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Movimentações</CardTitle>
        <CardDescription>Registros de alocações e movimentações do ativo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(
            asset.movements?.slice(0, 3) ?? []
          ).map((item, index) => (
            <div className={`flex items-start gap-4 border-l-2 ${index === 0 ? 'border-primary' : "border-muted"} pl-4`} key={item.id}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{item.reason}</p>
                  {index === 0 && 
                    (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Atual
                      </Badge>
                    )
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.fromLocation} • {formatDate(item.movementDate)}
                </p>
              </div>
          </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default MovementHistoryCard