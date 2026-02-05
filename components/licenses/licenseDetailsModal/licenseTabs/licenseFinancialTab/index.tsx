import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { formatCurrency, getLicenseDetails } from "@/lib/utils"
import { License } from "@/utils/schemas/license.schemas"
import { DollarSign } from "lucide-react"

export const LicenseFinancialTab = ({ license } : {license: License}) => {
  const { utilizationPercent } = getLicenseDetails(license)

  return (
    <TabsContent value="financial" className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Custo Anual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(license.annualCost)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Custo por Licença</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(license.annualCost / license.totalSeats)}
            </div>
            <div className="text-sm text-muted-foreground">por ano</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Custo Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(license.annualCost / 12)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Custo por Usuário/Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(license.annualCost / 12 / license.totalSeats)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Efficiency */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Eficiência de Custo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Custo total em uso</span>
            <span className="font-medium">
              {formatCurrency((license.annualCost / license.totalSeats) * (license.users?.length || 0))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Custo ocioso (não utilizado)</span>
            <span className="font-medium text-yellow-600">
              {formatCurrency(
                (license.annualCost / license.totalSeats) *
                  (license.totalSeats - (license.users?.length || 0))
              )}
            </span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Taxa de aproveitamento</span>
              <span
                className={`font-bold ${utilizationPercent >= 80 ? "text-green-600" : "text-yellow-600"}`}
              >
                {utilizationPercent}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
