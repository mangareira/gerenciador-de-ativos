import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, isExpiringSoon } from "@/lib/utils"
import { Contract } from "@/utils/schemas/contracts.schemas"

export const SummaryContracts= ({ contracts }:{contracts: Contract[]}) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Total de Contratos</div>
          <div className="text-2xl font-bold">{contracts.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Contratos Ativos</div>
          <div className="text-2xl font-bold">{contracts.filter((c) => c.status === "active").length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Expirando em 90 dias</div>
          <div className="text-2xl font-bold">
            {contracts.filter((c) => isExpiringSoon(c.endDate, 90)).length}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">Valor Total</div>
          <div className="text-2xl font-bold">
            {formatCurrency(contracts.reduce((sum, c) => sum + c.value, 0))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
