'use client'

import { CommentsTicketCard } from "@/components/ticket/commentsTicketCard";
import { DescriptionTicketCard } from "@/components/ticket/descriptionTicketCard";
import { InfoTicketCard } from "@/components/ticket/infoTicketCard";
import { ResolverTicketModal } from "@/components/ticket/resolverTicketModal";
import { StatusTicketCard } from "@/components/ticket/statusTicketCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStatusLabel, getTicketPriorityColor } from "@/lib/utils";
import { useGetTicket } from "@/utils/hooks/tickets/useGetTicket";
import { ArrowLeft, Edit } from "lucide-react";
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
            <ResolverTicketModal ticket={ticket} /> 
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
          <InfoTicketCard ticket={ticket} />
        </div>
      </div>
    </div>
  )
}
