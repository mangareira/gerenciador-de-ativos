import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { formatRelativeTime } from "@/lib/utils"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { Lock, MessageSquare } from "lucide-react"

export const CommentsTicketCard = ({ ticket } : { ticket: Ticket }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comentários e Atualizações
          <Badge variant="secondary" className="ml-auto">
            {ticket.comments?.length} {ticket.comments?.length === 1 ? "comentário" : "comentários"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {ticket.comments?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">Nenhum comentário ainda</p>
            </div>
          ) : (
            ticket.comments?.map((comment) => (
              <div
                key={comment.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  comment.isInternal ? "bg-amber-50 border border-amber-200" : "bg-muted/30"
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={comment.user?.avatar || "/placeholder.svg"} alt={comment.user?.name} />
                  <AvatarFallback>{comment.user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{comment.user?.name}</span>
                    {comment.isInternal && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-amber-100 text-amber-900 flex items-center gap-1"
                      >
                        <Lock className="h-3 w-3" />
                        Interno
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed wrap-break-word">{comment.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {ticket.status !== "closed" && (
          <div className="pt-4 border-t space-y-3">
            <Textarea placeholder="Adicionar comentário..." className="min-h-[100px]" />
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span className="text-muted-foreground">Comentário interno (não visível ao solicitante)</span>
              </label>
              <Button size="sm">Adicionar Comentário</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
