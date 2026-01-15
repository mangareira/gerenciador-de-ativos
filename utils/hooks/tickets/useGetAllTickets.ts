import { client } from "@/lib/hono"
import { TicketSchema } from "@/utils/schemas/tickets.schemas"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

export const useGetAllTickets = () => {
  const query = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const res = await client.api.ticket["get-all"].$get()

      if (!res.ok) {
          const error = await res.json()
          toast.error(error.error || "Erro ao buscar tickets")
          return
      }

      const { tickets } = await res.json()

      return TicketSchema.array().parse(tickets)
    }
  })

  return query
}
