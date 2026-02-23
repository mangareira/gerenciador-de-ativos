import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { formatCompactCurrency, formatCurrency } from "@/lib/utils"
import { License } from "@/utils/schemas/license.schemas"
import { BarChart3, DollarSign, Package, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export const LicensesTab = ({ licenses } : { licenses: License[] }) => {
  
  const licenseUtilizationData = licenses.map((license) => ({
    name: license.softwareName,
    used: license.users?.length || 0,
    available: license.totalSeats - (license.users?.length || 0),
    total: license.totalSeats,
  }))
  
  return (
    <TabsContent value="licenses" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Utilização de Licenças</CardTitle>
          <CardDescription>Licenças em uso vs disponíveis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={licenseUtilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={100} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="used" stackId="a" fill="#2563eb" name="Em Uso" />
              <Bar dataKey="available" stackId="a" fill="#10b981" name="Disponível" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Custo por Licença</CardTitle>
            <CardDescription>Distribuição de custos anuais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {licenses.map((license) => (
                <div key={license.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{license.softwareName}</div>
                    <div className="text-xs text-muted-foreground">{license.vendor}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary">{formatCurrency(license.annualCost)}</div>
                    <div className="text-xs text-muted-foreground">
                      {(license.users?.length || 0)}/{license.totalSeats} em uso
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Licenças</CardTitle>
            <CardDescription>Métricas gerais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Total de Licenças</div>
                  <div className="text-2xl font-bold">{licenses.reduce((sum, l) => sum + l.totalSeats, 0)}</div>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Licenças em Uso</div>
                  <div className="text-2xl font-bold">{licenses.reduce((sum, l) => sum + (l.users?.length || 0), 0)}</div>
                </div>
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Taxa de Utilização</div>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      (licenses.reduce((sum, l) => sum + (l.users?.length || 0), 0) /
                        licenses.reduce((sum, l) => sum + l.totalSeats, 0)) *
                        100,
                    )}
                    %
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Custo Total Anual</div>
                  <div className="text-2xl font-bold">
                    {formatCompactCurrency(licenses.reduce((sum, l) => sum + l.annualCost, 0))}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent> 
  )
}
