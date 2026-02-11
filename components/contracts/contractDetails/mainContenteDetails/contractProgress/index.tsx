import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDate, formatDuration, formatRemainingDuration, getContractDetails } from "@/lib/utils"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { Clock } from "lucide-react"

export const ContractProgress = ({ contract } : { contract: Contract }) => {

  const { progressPercent, daysUntilEnd } = getContractDetails(contract)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Progresso do Contrato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Inicio: {formatDate(contract.startDate)}</span>
          <span className="text-muted-foreground">Termino: {formatDate(contract.endDate)}</span>
        </div>
        <Progress value={progressPercent} className="h-3" />
        <div className="flex justify-between text-sm">
          <span>{Math.round(progressPercent)}% decorrido</span>
          <span className="text-muted-foreground">Duracao total: {formatDuration(contract.startDate, contract.endDate)}</span>
        </div>
        <div className="rounded-lg bg-muted/50 p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tempo restante:</span>
          <span className={`text-sm font-semibold ${daysUntilEnd <= 90 ? "text-amber-600" : daysUntilEnd <= 0 ? "text-red-600" : "text-foreground"}`}>
            {formatRemainingDuration(contract.endDate)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
