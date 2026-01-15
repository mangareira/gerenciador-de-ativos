import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { formatRelativeTime, getStatusLabel, getTicketPriorityColor, getTicketStatusColor } from "@/lib/utils"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Package, TicketIcon } from "lucide-react"
import Link from "next/link"

export const TicketTableContentAll = ({ tickets, isLoading = false }: { tickets: Ticket[]; isLoading?: boolean }) => {
  if (isLoading) {
    // render 3 skeleton cards using shared Skeleton component
    return (
      <TabsContent value="all" className="space-y-4">
        {[1,2,3].map((i) => (
          <Card key={`skeleton-${i}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
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
      <TabsContent value="all" className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <TicketIcon className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nenhum chamado encontrado.</p>
          </CardContent>
        </Card>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="all" className="space-y-4">
      {tickets.map((ticket) => {
        return (
          <Card 
            key={ticket.id} 
            className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-muted p-3">
                  <TicketIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link href={`/tickets/${ticket.id}`}>
                        <h3 className="font-semibold hover:underline">{ticket.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant="outline" className={getTicketPriorityColor(ticket.priority)}>
                        {getStatusLabel(ticket.priority)}
                      </Badge>
                      <Badge variant="outline" className={getTicketStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono text-xs">{ticket.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Categoria:</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {ticket.category}
                      </Badge>
                    </div>
                    {ticket.asset && (
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs">{ticket.asset.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{formatRelativeTime(ticket.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={ticket.requester?.avatar || "/placeholder.svg"} alt={ticket.requester?.name} />
                          <AvatarFallback>{ticket.requester?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs text-muted-foreground">Solicitante</p>
                          <p className="text-sm font-medium">{ticket.requester?.name}</p>
                        </div>
                      </div>
                      {ticket.assignedTo && (
                        <>
                          <div className="h-8 w-px bg-border" />
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ticket.assignedTo.avatar || "/placeholder.svg"} alt={ticket.assignedTo.name} />
                              <AvatarFallback>{ticket.assignedTo.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs text-muted-foreground">Atribuído a</p>
                              <p className="text-sm font-medium">{ticket.assignedTo.name}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/tickets/${ticket.id}`}>Ver Detalhes</Link>
                    </Button>
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
