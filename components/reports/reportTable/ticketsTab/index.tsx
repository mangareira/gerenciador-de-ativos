import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { subMonths } from 'date-fns'

const MONTH_NAMES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

export const TicketsTab = ({ tickets } : { tickets: Ticket[] }) => {
  const ticketsByCategoryData = [
    { category: "Hardware", count: tickets.filter((t) => t.category === "hardware").length },
    { category: "Software", count: tickets.filter((t) => t.category === "software").length },
    { category: "Rede", count: tickets.filter((t) => t.category === "network").length },
    { category: "Acesso", count: tickets.filter((t) => t.category === "access").length },
    { category: "Outros", count: tickets.filter((t) => t.category === "other").length },
  ]

  const months = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), 5 - i));
  const trendMap: Record<string, { opened: number; resolved: number; totalHours: number; count: number }> = {};
  months.forEach(m => {
    const monthName = MONTH_NAMES[m.getMonth()];
    trendMap[monthName] = { opened: 0, resolved: 0, totalHours: 0, count: 0 };
  });

  tickets.forEach(t => {
    const created = new Date(t.createdAt);
    const monthCreated = MONTH_NAMES[created.getMonth()];

    if (trendMap[monthCreated]) {
      trendMap[monthCreated].opened += 1;
    }

    if (t.resolvedAt) {
      const resolved = new Date(t.resolvedAt);
      const monthResolved = MONTH_NAMES[resolved.getMonth()];
      
      if (trendMap[monthResolved]) {
        trendMap[monthResolved].resolved += 1;
        
        const hours = Math.round((resolved.getTime() - created.getTime()) / (1000 * 60 * 60));
        trendMap[monthResolved].totalHours += hours;
        trendMap[monthResolved].count += 1;
      }
    }
  });

  const ticketTrendData = months.map(m => {
    const monthName = MONTH_NAMES[m.getMonth()];
    const data = trendMap[monthName];
    return {
      month: monthName,
      opened: data.opened,
      resolved: data.resolved,
      avgTime: data.count > 0 ? Math.round(data.totalHours / data.count) : 0
    };
  });

  const totalResolved = tickets.filter(t => t.resolvedAt).length;
  const overallAvg = totalResolved > 0
    ? Math.round(Object.values(trendMap).reduce((sum, it) => sum + it.totalHours, 0) / totalResolved)
    : 0;

  return (
    <TabsContent value="tickets" className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Chamados</CardTitle>
            <CardDescription>Abertura e resolução por mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="opened" stroke="#ef4444" name="Abertos" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolvidos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chamados por Categoria</CardTitle>
            <CardDescription>Distribuição por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketsByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" name="Quantidade" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tempo Médio de Resolução</CardTitle>
          <CardDescription>Evolução ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} label={{ value: "Horas", angle: -90, position: "insideLeft" }} />
              <Tooltip formatter={(value: number| undefined) => [`${value}h`, "Tempo Médio"]} />
              <Line type="monotone" dataKey="avgTime" stroke="#8b5cf6" strokeWidth={2} name="Tempo Médio" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Total de Chamados</div>
            <div className="text-3xl font-bold mt-2">{tickets.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Todos os períodos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Taxa de Resolução</div>
            <div className="text-3xl font-bold mt-2">
              {Math.round((tickets.filter((t) => t.status === "resolved").length / tickets.length) * 100)}%
            </div>
            <div className="text-xs text-green-600 mt-1">
              {tickets.filter((t) => t.status === "resolved").length} resolvidos
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm text-muted-foreground">Tempo Médio</div>
            <div className="text-3xl font-bold mt-2">{overallAvg}h</div>
            <div className="text-xs text-muted-foreground mt-1">Resolução de chamados</div>
          </CardContent>
        </Card>
      </div>
    </TabsContent> 
  )
}
