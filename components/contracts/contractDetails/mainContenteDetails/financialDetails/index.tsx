import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, frequencyLabels, getContractDetails, getMonthlyValue, getTotalContractValue } from "@/lib/utils"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { DollarSign } from "lucide-react"

export const FinancialDetails = ({ contract } : { contract: Contract }) => {
  const { totalDays } = getContractDetails(contract)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Detalhes Financeiros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Valor por Periodo</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(contract.value)}</p>
            <p className="text-xs text-muted-foreground">{frequencyLabels[contract.paymentFrequency]}</p>
          </div>
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Custo Mensal Estimado</p>
            <p className="text-2xl font-bold">{formatCurrency(getMonthlyValue(contract, totalDays))}</p>
            <p className="text-xs text-muted-foreground">Valor proporcional</p>
          </div>
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Valor Total do Contrato</p>
            <p className="text-2xl font-bold">{formatCurrency(getTotalContractValue(contract, totalDays))}</p>
            <p className="text-xs text-muted-foreground">Durante toda vigencia</p>
          </div>
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-sm text-muted-foreground">Custo por Ativo</p>
            <p className="text-2xl font-bold">
              {contract.contractAssets.length > 0
                ? formatCurrency(getTotalContractValue(contract, totalDays) / contract.contractAssets.length)
                : "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">Valor total / ativos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
