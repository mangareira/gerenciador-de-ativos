'use client'

import { CommentsTicketCard } from "@/components/ticket/commentsTicketCard";
import { DescriptionTicketCard } from "@/components/ticket/descriptionTicketCard";
import { StatusTicketCard } from "@/components/ticket/statusTicketCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusLabel, getTicketPriorityColor } from "@/lib/utils";
import { useGetTicket } from "@/utils/hooks/tickets/useGetTicket";
import { ArrowLeft, CheckCircle, Edit } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TicketDetailsPage() {
  const params = useParams<{ id: string }>()
  const id = params.id

  const { data: ticket } = useGetTicket(id)

  if(!ticket) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/tickets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{ticket.title}</h1>
              <Badge variant="outline" className={getTicketPriorityColor(ticket.priority)}>
                {getStatusLabel(ticket.priority)}
              </Badge>
            </div>
            <p className="text-muted-foreground">Chamado #{ticket.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {ticket.status !== "resolved" && ticket.status !== "closed" && (
            <Button variant="outline">
              <CheckCircle className="mr-2 h-4 w-4" />
              Resolver
            </Button>
          )}
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <DescriptionTicketCard ticket={ticket} />
          <CommentsTicketCard ticket={ticket} />
        </div>

        <div className="space-y-6">
          <StatusTicketCard ticket={ticket} />
          {/* 
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
                    <AvatarImage src={requester?.avatar || "/placeholder.svg"} alt={requester?.name} />
                    <AvatarFallback>{requester?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{requester?.name}</div>
                    <div className="text-xs text-muted-foreground">{requester?.email}</div>
                  </div>
                </div>
              </div>

              {assignedTo && (
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Atribuído a</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={assignedTo.avatar || "/placeholder.svg"} alt={assignedTo.name} />
                      <AvatarFallback>{assignedTo.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{assignedTo.name}</div>
                      <div className="text-xs text-muted-foreground">{assignedTo.role}</div>
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

              {relatedAsset && (
                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Ativo Relacionado</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{relatedAsset.name}</div>
                    <div className="text-xs text-muted-foreground">{relatedAsset.model}</div>
                    <div className="text-xs text-muted-foreground font-mono">{relatedAsset.serialNumber}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent" asChild>
                    <Link href={`/assets/${relatedAsset.id}`}>Ver Ativo</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
