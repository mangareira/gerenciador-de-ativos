import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate, formatDuration, formatRemainingDuration, getContractStatusColor, getDaysUntil, getStatusLabel, isExpiringSoon } from "@/lib/utils"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { AlertTriangle, Calendar, DollarSign, Eye, FileText, Mail, Package, Phone } from "lucide-react"
import Link from "next/link"
import { EditContractModal } from "../editContractModal"

export const ContractListCard = ({ contracts }:{ contracts: Contract[] }) => {
  return (
    <div className="grid gap-4">
      {contracts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-medium text-lg mb-1">Nenhum contrato encontrado</h3>
            </CardContent>
          </Card>
      ) : null}
      {contracts.map((contract) => {
        const isExpiring = isExpiringSoon(contract.endDate, 90)
        const daysUntilEnd = getDaysUntil(contract.endDate)

        return (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{contract.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{contract.vendor}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className={getContractStatusColor(contract.status)}>
                    {getStatusLabel(contract.status)}
                  </Badge>
                  {isExpiring && daysUntilEnd >= 0 && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Vence em {daysUntilEnd} dias
                    </Badge>
                  )}
                  {contract.autoRenew && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Auto-renovação
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Informações</div>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Tipo: </span>
                      <Badge variant="outline" className="text-xs">
                        {contract.type === "maintenance" && "Manutenção"}
                        {contract.type === "support" && "Suporte"}
                        {contract.type === "lease" && "Leasing"}
                        {contract.type === "warranty" && "Garantia"}
                      </Badge>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Número: </span>
                      <span className="font-mono">{contract.contractNumber}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Notificação: </span>
                      <span>{contract.notificationDays} dias antes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>Vigência</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Início: </span>
                      <span>{formatDate(contract.startDate)}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Fim: </span>
                      <span className={isExpiring ? "font-semibold text-yellow-600" : ""}>
                        {formatDate(contract.endDate)}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Duração: </span>
                      <span>{formatDuration(contract.startDate, contract.endDate)}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Restante: </span>
                      <span className={`font-medium ${daysUntilEnd <= 90 && daysUntilEnd > 0 ? "text-amber-600" : daysUntilEnd <= 0 ? "text-red-600" : "text-emerald-600"}`}>
                        {formatRemainingDuration(contract.endDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Valores</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Valor Total: </span>
                      <span className="font-semibold text-primary">{formatCurrency(contract.value)}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Frequência: </span>
                      <span>
                        {contract.paymentFrequency === "monthly" && "Mensal"}
                        {contract.paymentFrequency === "quarterly" && "Trimestral"}
                        {contract.paymentFrequency === "annually" && "Anual"}
                        {contract.paymentFrequency === "one_time" && "Único"}
                      </span>
                    </div>
                    {contract.paymentFrequency === "monthly" && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Mensal: </span>
                        <span>{formatCurrency(contract.value)}</span>
                      </div>
                    )}
                    {contract.paymentFrequency === "annually" && (
                      <div className="text-xs">
                        <span className="text-muted-foreground">Anual: </span>
                        <span>{formatCurrency(contract.value)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">Contato</div>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Nome: </span>
                      <span className="font-medium">{contract.contactPerson}</span>
                    </div>
                    <div className="text-xs flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate">{contract.contactEmail}</span>
                    </div>
                    <div className="text-xs flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{contract.contactPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {contract.contractAssets.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Package className="h-4 w-4" />
                    <span>Ativos Relacionados ({contract.contractAssets.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contract.contractAssets.map((asset) => (
                      <Badge key={asset?.id} variant="outline" className="text-xs">
                        {asset?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {contract.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">{contract.notes}</p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-transparent" asChild>
                  <Link href={`/contracts/${contract.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Link>
                </Button>
                <EditContractModal contract={contract} />
                {/* <RenewContractModal contract={contract} /> */}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
