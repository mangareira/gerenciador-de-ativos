import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, getContractDetails, getDaysUntil, getLicenseDetails } from "@/lib/utils"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { License } from "@/utils/schemas/license.schemas"
import { AlertTriangle, Calendar } from "lucide-react"

export function ExpiringItems({ contracts, licenses } : { licenses: License[], contracts: Contract[] }) {
  // Get expiring licenses and contracts
  const expiringLicenses = licenses
    .filter((l) => l.expiryDate && getDaysUntil(l.expiryDate) <= 90 && getDaysUntil(l.expiryDate) >= 0)
    .sort((a, b) => getDaysUntil(a.expiryDate!) - getDaysUntil(b.expiryDate!))
    .slice(0, 3)

  const expiringContracts = contracts
    .filter((c) => getDaysUntil(c.endDate) <= 90 && getDaysUntil(c.endDate) >= 0)
    .sort((a, b) => getDaysUntil(a.endDate) - getDaysUntil(b.endDate))
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens Expirando</CardTitle>
        <CardDescription>Licenças e contratos próximos do vencimento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expiringLicenses.length === 0 && expiringContracts.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">Nenhum item expirando nos próximos 90 dias</p>
          )}

          {expiringLicenses.map((license) => {
            const { daysUntilExpiry } = getLicenseDetails(license)

            const isUrgent =( daysUntilExpiry || 0)  <= 30

            return (
              <div key={license.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div
                  className={`rounded-lg p-2 ${isUrgent ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}
                >
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{license.softwareName}</p>
                    {isUrgent && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  </div>
                  <p className="text-xs text-muted-foreground">Licença</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        isUrgent
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                    >
                      {daysUntilExpiry} dias restantes
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(license.expiryDate!)}</span>
                  </div>
                </div>
              </div>
            )
          })}

          {expiringContracts.map((contract) => {
            const { daysUntilEnd } =  getContractDetails(contract)

            const isUrgent = daysUntilEnd <= 30

            return (
              <div key={contract.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                <div
                  className={`rounded-lg p-2 ${isUrgent ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}
                >
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{contract.title}</p>
                    {isUrgent && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  </div>
                  <p className="text-xs text-muted-foreground">Contrato</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        isUrgent
                          ? "bg-red-100 text-red-800 border-red-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }
                    >
                      {daysUntilEnd} dias restantes
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(contract.endDate)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}