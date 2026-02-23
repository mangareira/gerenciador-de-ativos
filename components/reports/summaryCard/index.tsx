import { Card, CardContent } from "@/components/ui/card"
import { formatCompactCurrency } from "@/lib/utils"
import { Report } from "@/utils/schemas/report.schemas"
import { DollarSign, FileKey, Package, Ticket } from "lucide-react"

export const SummaryCard = ({ report } : { report: Report }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Valor Total de Ativos</div>
              <div className="text-2xl font-bold">
                {formatCompactCurrency(report.assets.reduce((sum, a) => sum + a.currentValue, 0))}
              </div>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Custo Anual Licenças</div>
              <div className="text-2xl font-bold">
                {formatCompactCurrency(report.licenses.reduce((sum, l) => sum + l.annualCost, 0))}
              </div>
            </div>
            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <FileKey className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Valor Contratos</div>
              <div className="text-2xl font-bold">
                {formatCompactCurrency(report.contracts.reduce((sum, c) => sum + c.value, 0))}
              </div>
            </div>
            <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Taxa Resolução</div>
              <div className="text-2xl font-bold">
                {Math.round((report.tickets.filter((t) => t.status === "resolved").length / report.tickets.length) * 100)}%
              </div>
            </div>
            <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
              <Ticket className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
