// utils/hooks/tickets/useUpdateTicket.ts
import { client } from "@/lib/hono"
import { UpdateTicket } from "@/utils/schemas/tickets.schemas"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useUpdateTicket = (ticketId: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: UpdateTicket) => {
      const res = await client.api.ticket.update[":ticketId"].$put({
        param: { ticketId },
        json: data,
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao atualizar ticket")
      }
    },
    onSuccess: () => {
      toast.success("Ticket atualizado com sucesso")
      // Invalida as queries para refetch
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] })
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return mutation
}