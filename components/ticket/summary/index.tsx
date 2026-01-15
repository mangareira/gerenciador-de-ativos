import { Card, CardContent } from "@/components/ui/card"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { Clock, TicketIcon } from "lucide-react"

export const SummaryTickets = ({ tickets }: {tickets: Ticket[]}) => {

  const openTickets = tickets.filter((ticket) => ticket.status === "open")
  const criticalTickets = tickets.filter((ticket) => ticket.priority === "critical")
  const pendingTickets = tickets.filter((ticket) => ticket.status === "pending")
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved")
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Abertos</div>
              <div className="text-2xl font-bold">{openTickets.length}</div>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <TicketIcon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Críticos</div>
              <div className="text-2xl font-bold">{criticalTickets.length}</div>
            </div>
            <div className="rounded-lg bg-red-100 p-3 text-red-600">
              <TicketIcon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Pendentes</div>
              <div className="text-2xl font-bold">{pendingTickets.length}</div>
            </div>
            <div className="rounded-lg bg-yellow-100 p-3 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Resolvidos</div>
              <div className="text-2xl font-bold">{resolvedTickets.length}</div>
            </div>
            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <TicketIcon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
