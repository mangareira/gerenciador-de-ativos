import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { formatRelativeTime, getStatusLabel, getTicketPriorityColor, getTicketStatusColor } from "@/lib/utils"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { Skeleton } from "@/components/ui/skeleton"
import { TicketIcon } from "lucide-react"
import Link from "next/link"

export const TicketTableContentOpen = ({ tickets, isLoading = false }: { tickets: Ticket[]; isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <TabsContent value="open" className="space-y-4">
        {[1,2].map(i => (
          <Card key={`s-open-${i}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    )
  }

  if (!tickets.length) {
    return (
      <TabsContent value="open" className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <TicketIcon className="mx-auto mb-2 h-6 w-6 text-blue-600" />
            <p className="text-sm text-muted-foreground">Nenhum chamado aberto.</p>
          </CardContent>
        </Card>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="open" className="space-y-4">
      {tickets.map((ticket) => {
        return (
          <Card 
            key={ticket.id} 
            className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                  <TicketIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/tickets/${ticket.id}`}>
                        <h3 className="font-semibold hover:underline">{ticket.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {ticket.requester?.name} • {formatRelativeTime(ticket.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getTicketPriorityColor(ticket.priority)}>
                        {getStatusLabel(ticket.priority)}
                      </Badge>
                      <Badge variant="outline" className={getTicketStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </TabsContent>
  )
}
