import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTypeLabel } from "@/lib/utils"
import { Asset } from "@/utils/schemas/assets.schemas"
import { Pie, PieChart, PieLabelRenderProps, PieSectorShapeProps, ResponsiveContainer, Sector, Tooltip } from "recharts"

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]

export const AssetDistributionChart = ({ assets } : { assets: Asset[] }) => {
  const typeCount = assets.reduce<Record<string, number>>((acc, asset) => {
    const type = asset.type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(typeCount).map(([type, count]) => ({
    name: getTypeLabel(type),
    value: count,
  }));

  
  const renderShape = (props: PieSectorShapeProps) => {
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
        {`${payload?.name}: ${((percent || 0) * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Ativos</CardTitle>
        <CardDescription>Ativos por tipo de equipamento</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}          
              outerRadius={80}
              dataKey="value"
              shape={renderShape} 
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
