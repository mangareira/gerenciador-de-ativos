import { client } from "@/lib/hono"
import { TicketSchema } from "@/utils/schemas/tickets.schemas"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useGetTicket = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["ticket", id],
    queryFn: async () => {
      
      const res = await client.api.ticket["get-by-id"][":id"].$get({
        param: {
          id,
        }
      })

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.error || "Erro ao buscar tickets")
        return
      }

      const { ticket } = await res.json()

      return TicketSchema.parse(ticket)
    }
  })

  return query
}
