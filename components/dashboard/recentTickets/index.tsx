import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRelativeTime, getStatusLabel, getTicketPriorityColor, getTicketStatusColor } from "@/lib/utils"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export function RecentTickets({ tickets } : { tickets: Ticket[] }) {
  const recentTickets = tickets
    .filter((t) => t.status !== "closed")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Chamados Recentes</CardTitle>
          <CardDescription>Últimos chamados abertos no sistema</CardDescription>
        </div>
        <Link href="/tickets">
          <ArrowUpRight className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTickets.map((ticket) => {
            return (
              <div key={ticket.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium leading-none">{ticket.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getTicketPriorityColor(ticket.priority)}>
                      {getStatusLabel(ticket.priority)}
                    </Badge>
                    <Badge variant="outline" className={getTicketStatusColor(ticket.status)}>
                      {getStatusLabel(ticket.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Aberto por {ticket.requester?.name} • {formatRelativeTime(ticket.createdAt)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
