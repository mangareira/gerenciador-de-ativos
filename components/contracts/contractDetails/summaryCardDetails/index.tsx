import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, frequencyLabels, getContractDetails } from "@/lib/utils"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { Calendar, DollarSign, Package, RefreshCw } from "lucide-react"

export const SummaryCardDetails = ({ contract } : {contract : Contract }) => {
  const { daysUntilEnd } = getContractDetails(contract)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Valor ({frequencyLabels[contract.paymentFrequency]})</p>
              <p className="text-lg font-bold">{formatCurrency(contract.value)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dias Restantes</p>
              <p className="text-lg font-bold">{daysUntilEnd > 0 ? daysUntilEnd : "Vencido"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ativos Cobertos</p>
              <p className="text-lg font-bold">{contract.contractAssets.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Auto-Renovacao</p>
              <p className="text-lg font-bold">{contract.autoRenew ? "Sim" : "Nao"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
