import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime, formatRelativeTime } from "@/lib/utils"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { Clock, Package, User } from "lucide-react"
import Link from "next/link"

export const InfoTicketCard = ({ ticket } : { ticket: Ticket }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Solicitante</span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={ticket.requester.avatar || "/placeholder.svg"} alt={ticket.requester.name} />
              <AvatarFallback>{ticket.requester.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{ticket.requester.name}</div>
              <div className="text-xs text-muted-foreground">{ticket.requester.email}</div>
            </div>
          </div>
        </div>

        {ticket.assignedTo && (
          <div className="space-y-2 pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Atribuído a</span>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={ticket.assignedTo.avatar || "/placeholder.svg"} alt={ticket.assignedTo.name} />
                <AvatarFallback>{ticket.assignedTo.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{ticket.assignedTo.name}</div>
                <div className="text-xs text-muted-foreground">{ticket.assignedTo.role}</div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Datas</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Criado:</span>
              <span>{formatDateTime(ticket.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Atualizado:</span>
              <span>{formatRelativeTime(ticket.updatedAt)}</span>
            </div>
            {ticket.estimatedResolutionDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Previsão:</span>
                <span>{formatDateTime(ticket.estimatedResolutionDate)}</span>
              </div>
            )}
            {ticket.resolvedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Resolvido:</span>
                <span>{formatDateTime(ticket.resolvedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t">
          <div className="text-sm text-muted-foreground">Categoria</div>
          <Badge variant="outline" className="capitalize">
            {ticket.category}
          </Badge>
        </div>

        {ticket.asset && (
          <div className="space-y-2 pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Ativo Relacionado</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">{ticket.asset.name}</div>
              <div className="text-xs text-muted-foreground">{ticket.asset.model}</div>
              <div className="text-xs text-muted-foreground font-mono">{ticket.asset.serialNumber}</div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" asChild>
              <Link href={`/assets/${ticket.asset.id}`}>Ver Ativo</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card> 
  )
}
