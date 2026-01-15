import { Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { TicketTableContentAll } from "./ticketTableContentAll"
import { TicketTableContentOpen } from "./ticketTableContentOpen"
import { TicketTableContentPending } from "./ticketTableContentPending"
import { TicketTableContentResolved } from "./tickteTableContentResolved"
import { Ticket } from "@/utils/schemas/tickets.schemas"

export const TicketsTable = ({ tickets, isLoading = false }: { tickets: Ticket[]; isLoading?: boolean }) => {
  const openTickets = tickets.filter((ticket) => ticket.status === "open")
  const pendingTickets = tickets.filter((ticket) => ticket.status === "pending")
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved")

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">Todos ({tickets.length})</TabsTrigger>
        <TabsTrigger value="open">Abertos ({openTickets.length})</TabsTrigger>
        <TabsTrigger value="pending">Pendentes ({pendingTickets.length})</TabsTrigger>
        <TabsTrigger value="resolved">Resolvidos ({resolvedTickets.length})</TabsTrigger>
      </TabsList>

      <TicketTableContentAll tickets={tickets} isLoading={isLoading} />

      <TicketTableContentOpen tickets={openTickets} isLoading={isLoading} />

      <TicketTableContentPending tickets={pendingTickets} isLoading={isLoading} /> 

      <TicketTableContentResolved tickets={resolvedTickets} isLoading={isLoading} />

    </Tabs>

  )
}
