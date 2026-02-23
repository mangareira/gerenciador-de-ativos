import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { Report } from "@/utils/schemas/report.schemas"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts"

export const FinancialTab = ({ report } : { report: Report }) => {
  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]

  const costBreakdown = [
    { name: "Ativos", value: report.assets.reduce((sum, a) => sum + a.currentValue, 0) },
    { name: "Licenças (Anual)", value: report.licenses.reduce((sum, l) => sum + l.annualCost, 0) },
    { name: "Contratos", value: report.contracts.reduce((sum, c) => sum + c.value, 0) },
  ]

  const renderShape = (props: PieSectorShapeProps) => {
    // As props recebidas aqui incluem: payload, percent, cx, cy, ... e também o index
    const { index, ...sectorProps } = props;
    return <Sector {...sectorProps} fill={COLORS[index % COLORS.length]} />;
  };
  
  const renderLabel = (props: PieLabelRenderProps) => {
    const { name, percent, index, x, y, textAnchor, dominantBaseline } = props;
    const color = COLORS[index % COLORS.length];
    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={textAnchor}
        dominantBaseline={dominantBaseline}
        fontSize={12}
        fontWeight="bold"
      >
        {`${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
      </text>
    );
  };

  const assetsByDepartment = report.departments.map((dept) => {
    const deptAssets = report.assets.filter((a) => a.departmentId === dept.id)
    return {
      department: dept.name,
      count: deptAssets.length,
      value: deptAssets.reduce((sum, a) => sum + a.currentValue, 0),
    }
  })

  return (
    <TabsContent value="financial" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Custos</CardTitle>
            <CardDescription>Breakdown por categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius={80}
                  dataKey="value"
                  shape={renderShape}
                />
                <Tooltip formatter={(value: number | undefined) => formatCurrency(value ?? 0)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor Total por Departamento</CardTitle>
            <CardDescription>Custos alocados</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assetsByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value: number | undefined) => formatCurrency(value ?? 0)} />
                <Bar dataKey="value" fill="#8b5cf6" name="Valor Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
          <CardDescription>Visão consolidada de investimentos e custos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Investimento Total em Ativos</div>
              <div className="text-2xl font-bold">
                {formatCurrency(report.assets.reduce((sum, a) => sum + a.purchasePrice, 0))}
              </div>
              <div className="text-xs text-muted-foreground">Valor de compra original</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Valor Atual de Ativos</div>
              <div className="text-2xl font-bold">
                {formatCurrency(report.assets.reduce((sum, a) => sum + a.currentValue, 0))}
              </div>
              <div className="text-xs text-red-600">
                -
                {Math.round(
                  ((report.assets.reduce((sum, a) => sum + a.purchasePrice, 0) -
                    report.assets.reduce((sum, a) => sum + a.currentValue, 0)) /
                    report.assets.reduce((sum, a) => sum + a.purchasePrice, 0)) *
                    100,
                )}
                % depreciação
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Custo Mensal Recorrente</div>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  report.licenses.reduce((sum, l) => sum + l.annualCost / 12, 0) +
                    report.contracts
                      .filter((c) => c.paymentFrequency === "monthly")
                      .reduce((sum, c) => sum + c.value, 0),
                )}
              </div>
              <div className="text-xs text-muted-foreground">Licenças + Contratos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent> 
  )
}
