import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { formatCurrency, getAssetStatusColor, getStatusLabel } from "@/lib/utils"
import { Asset } from "@/utils/schemas/assets.schemas"
import { Department } from "@/utils/schemas/department.schemas"
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts"


export const AssetTab = ({ assets, departments } : {assets: Asset[], departments: Department[]}) => {
  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]
  const assetStatusData = [
    { status: "Em Uso", count: assets.filter((a) => a.status === "in_use").length },
    { status: "Disponível", count: assets.filter((a) => a.status === "available").length },
    { status: "Manutenção", count: assets.filter((a) => a.status === "maintenance").length },
    { status: "Aposentado", count: assets.filter((a) => a.status === "retired").length },
  ]

  const assetsByDepartment = departments.map((dept) => {
    const deptAssets = assets.filter((a) => a.departmentId === dept.id)
    return {
      department: dept.name,
      count: deptAssets.length,
      value: deptAssets.reduce((sum, a) => sum + a.currentValue, 0),
    }
  })

  const renderShape = (props: PieSectorShapeProps) => {
    // As props recebidas aqui incluem: payload, percent, cx, cy, ... e também o index
    const { index, ...sectorProps } = props;
    return <Sector {...sectorProps} fill={COLORS[index % COLORS.length]} />;
  };

  const renderLabel = (props: PieLabelRenderProps) => {
    const { payload, percent, index, x, y, textAnchor, dominantBaseline } = props;
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
        {`${payload?.status}: ${((percent || 0) * 100).toFixed(0)}%`}
      </text>
    );
  };

  const depreciationData = assets
  .map((asset) => {
    const depreciationPercent = Math.round(((asset.purchasePrice - asset.currentValue) / asset.purchasePrice) * 100)
    return {
      name: asset.name,
      depreciation: depreciationPercent,
      purchaseValue: asset.purchasePrice,
      currentValue: asset.currentValue,
    }
  })
  .slice(0, 5)

  return (
    <TabsContent value="assets" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ativos por Departamento</CardTitle>
            <CardDescription>Quantidade e valor por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assetsByDepartment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: number | undefined, name: string | undefined) => [
                    name === "value" ? formatCurrency(value ?? 0) : value ?? 0,
                    name === "value" ? "Valor" : "Quantidade",
                  ]}
                />
                <Legend />
                <Bar dataKey="count" fill="#2563eb" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
            <CardDescription>Status atual dos ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetStatusData.filter(item => item.count > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}          
                  outerRadius={80}
                  dataKey="count"
                  shape={renderShape} // <-- Use a prop shape aqui
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Ativos - Depreciação</CardTitle>
          <CardDescription>Análise de depreciação dos principais ativos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={depreciationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" width={150} fontSize={12} />
              <Tooltip formatter={(value: number | undefined) => `${value ?? 0}%`} />
              <Bar dataKey="depreciation" fill="#ef4444" name="Depreciação %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Asset List */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Ativos</CardTitle>
          <CardDescription>Lista completa com informações principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.slice(0, 10).map((asset) => (
              <div key={asset.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <div className="font-medium">{asset.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {asset.model} • {asset.serialNumber}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatCurrency(asset.currentValue)}</div>
                    <div className="text-xs text-muted-foreground">
                      -{Math.round(((asset.purchasePrice - asset.currentValue) / asset.purchasePrice) * 100)}%
                      deprec.
                    </div>
                  </div>
                  <Badge variant="outline" className={getAssetStatusColor(asset.status)}>
                    {getStatusLabel(asset.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
