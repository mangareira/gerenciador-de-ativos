import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStatusLabel } from "@/lib/utils"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export const TicketStatusChart = ({ tickets } : { tickets: Ticket[] }) => {
  const statusCount = tickets.reduce<Record<string, number>>((acc, ticket) => {
    const status = ticket.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCount).map(([status, count]) => ({
    name: getStatusLabel(status),
    value: count,
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Ativos</CardTitle>
        <CardDescription>Ativos por tipo de equipamento</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              formatter={(value: number | undefined) => [
                value,
                "Quantidade"
              ]}
            />
            <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
