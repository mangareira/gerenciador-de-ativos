import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatDuration, formatRemainingDuration, getContractDetails, typeLabels } from "@/lib/utils"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { Calendar, CheckCircle, Shield } from "lucide-react"

export const ContractInfo = ({ contract } : { contract: Contract }) => {
  const { daysUntilEnd, isExpiring } = getContractDetails(contract)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informacoes Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Tipo</span>
            <Badge variant="outline">{typeLabels[contract.type]}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fornecedor</span>
            <span className="text-sm font-medium">{contract.vendor}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Numero</span>
            <span className="text-xs font-mono">{contract.contractNumber}</span>
          </div>
        </div>

        <div className="border-t pt-3 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Vigencia</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Inicio:</span>
              <span>{formatDate(contract.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Termino:</span>
              <span className={isExpiring ? "font-semibold text-yellow-600" : ""}>{formatDate(contract.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duracao:</span>
              <span>{formatDuration(contract.startDate, contract.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Restante:</span>
              <span className={`font-medium ${daysUntilEnd <= 90 ? "text-amber-600" : daysUntilEnd <= 0 ? "text-red-600" : "text-emerald-600"}`}>
                {formatRemainingDuration(contract.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-3 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Configuracoes</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto-renovacao:</span>
              <span className="flex items-center gap-1">
                {contract.autoRenew ? (
                  <><CheckCircle className="h-3 w-3 text-green-600" /> Sim</>
                ) : (
                  "Nao"
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notificacao:</span>
              <span>{contract.notificationDays} dias antes</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

  )
}
