'use client'

import { SummaryContracts } from "@/components/contracts/summary";
import SearchTool from "@/components/search"
import { Button } from "@/components/ui/button"
import { useGetAllContracts } from "@/utils/hooks/contracts/useGetAllContracts";
import { Plus } from "lucide-react"
import { useState } from "react";

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");  
  const [statusFilter, setStatusFilter] = useState("all");

  const {data: contracts } = useGetAllContracts()
  

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">Gerencie contratos de manutenção, suporte e leasing</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>
      {/* Search */}
      <SearchTool 
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        // statusOptions={statusOptions}
        // typeOptions={typeOptions}
        titlePlaceholder="Buscar por título, fornecedor ou número do contrato..."
      />

      {/* Contracts List */}
      <div className="grid gap-4">
        {/* {mockContracts.map((contract) => {
          const isExpiring = isExpiringSoon(contract.endDate, 90)
          const daysUntilEnd = getDaysUntil(contract.endDate)
          const relatedAssetsData = contract.relatedAssets
            .map((assetId) => mockAssets.find((a) => a.id === assetId))
            .filter(Boolean)

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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"> */}
                  {/* Type & Number */}
                  {/* <div className="space-y-2">
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
                  </div> */}

                  {/* Dates */}
                  {/* <div className="space-y-2">
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
                        <span>
                          {Math.round(
                            (new Date(contract.endDate).getTime() - new Date(contract.startDate).getTime()) /
                              (1000 * 60 * 60 * 24 * 365),
                          )}{" "}
                          anos
                        </span>
                      </div>
                    </div>
                  </div> */}

                  {/* Payment */}
                  {/* <div className="space-y-2">
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
                          {contract.paymentFrequency === "one-time" && "Único"}
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
                  </div> */}

                  {/* Contact */}
                  {/* <div className="space-y-2">
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
                </div> */}

                {/* Related Assets */}
                {/* {relatedAssetsData.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Package className="h-4 w-4" />
                      <span>Ativos Relacionados ({relatedAssetsData.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {relatedAssetsData.map((asset) => (
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

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Renovar
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          {/* )
        })} */}
      </div>

      {/* Summary Stats */}
      <SummaryContracts contracts={contracts || []} />
    </div>
  )
}
