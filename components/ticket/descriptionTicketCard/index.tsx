import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/lib/utils"
import { Ticket } from "@/utils/schemas/tickets.schemas"
import { CheckCircle } from "lucide-react"

export const DescriptionTicketCard = ({ ticket } : { ticket: Ticket }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{ticket.description}</p>
        </CardContent>
      </Card>

      {ticket.resolution && (
        <Card className="border-green-200 bg-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <CheckCircle className="h-5 w-5" />
              Resolução
            </CardTitle>
            <CardDescription>Resolvido em {formatDateTime(ticket.resolvedAt!)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-green-900">{ticket.resolution}</p>
          </CardContent>
        </Card>
      )}
    </>
  )
}
