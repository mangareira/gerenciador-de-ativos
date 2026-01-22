import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUpdateTicket } from "@/utils/hooks/tickets/useUpdateTicket"
import { zodResolver } from "@hookform/resolvers/zod"
import { Ticket, UpdateTicket, UpdateTicketSchema } from "@/utils/schemas/tickets.schemas"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

export const ResolverTicketModal = ({ ticket } : { ticket: Ticket }) => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(UpdateTicketSchema),
    defaultValues: {
      status: "resolved"
    }
  })

  const { mutate, isPending } = useUpdateTicket(ticket.id)

  const onSubmit = (data: UpdateTicket) => {
    mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          <CheckCircle className="mr-2 h-4 w-4" />
          Resolver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Resolver Chamado
          </DialogTitle>
          <DialogDescription>
            Registre a resolução do chamado <span className="font-medium">#{ticket.id}</span>: {ticket.title}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolução *</FormLabel>
                  <FormControl>
                    <Textarea     
                      placeholder="Descreva detalhadamente como o problema foi resolvido..."
                      className="min-h-[120px] resize-none"
                      onKeyDown={(e) => e.stopPropagation()}
                      rows={3} 
                      {...field} 
                      value={field.value ?? ""} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="bg-transparent"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resolvendo...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Resolver Chamado
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
