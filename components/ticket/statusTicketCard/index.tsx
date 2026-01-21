import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStatusLabel } from "@/lib/utils"
import { useUpdateTicket } from "@/utils/hooks/tickets/useUpdateTicket"

import { Ticket, UpdateTicket, UpdateTicketSchema } from "@/utils/schemas/tickets.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export const StatusTicketCard = ({ ticket } : { ticket: Ticket }) => {
  const form = useForm<UpdateTicket>({
    resolver: zodResolver(UpdateTicketSchema),
    defaultValues: {
      status: ticket.status,
      priority: ticket.priority,
    }
  })

  const { mutate, isPending } = useUpdateTicket(ticket.id)

  const onSubmit = async (data: UpdateTicket) => {
    mutate(data)
  }


  const handleValueChange = (field: keyof UpdateTicket) => (value: string) => {
    form.setValue(field, value)
    form.handleSubmit(onSubmit)()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Atual</FormLabel>
                  <Select
                    onValueChange={handleValueChange("status")}
                    value={field.value}
                    disabled={isPending || ticket.status === "resolved"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {getStatusLabel(field.value ?? "")}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Aberto</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="resolved">Resolvido</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <Select
                    onValueChange={handleValueChange("priority")}
                    value={field.value}
                    disabled={isPending || ticket.status === "resolved"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {getStatusLabel(field.value ?? "")}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
