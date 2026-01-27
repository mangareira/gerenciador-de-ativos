import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUpdateTicket } from "@/utils/hooks/tickets/useUpdateTicket"
import { Ticket, UpdateTicket, UpdateTicketSchema } from "@/utils/schemas/tickets.schemas"
import { Select as SelectOptions } from "@/components/select"

import { Edit, Loader2, Save } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Option } from "@/types/options"


export const EditTicketModal = ({ ticket, technicianOptions, assetsOptions } : { 
  ticket : Ticket
  technicianOptions: Option[]
  assetsOptions: Option[]  
}) => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(UpdateTicketSchema),
    defaultValues: ticket
  })

  const { mutate, isPending } = useUpdateTicket(ticket.id)

  const onSubmit = (data: UpdateTicket) => {
    mutate(data,
      {
        onSuccess: () => {
          setOpen(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Editar Chamado
          </DialogTitle>
          <DialogDescription>
            Edite as informações do chamado <span className="font-medium">#{ticket.id}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Titulo do chamado"
                      onKeyDown={(e) => e.stopPropagation()}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descricao *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o problema detalhadamente..."
                      className="min-h-[100px] resize-none"
                      onKeyDown={(e) => e.stopPropagation()}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid gap-4 grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="network">Rede</SelectItem>
                          <SelectItem value="access">Acesso</SelectItem>
                          <SelectItem value="other">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedToId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atribuir para</FormLabel>
                    <FormControl>
                      <SelectOptions
                        placeholder="Selecione um tecnico"
                        options={technicianOptions}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ativo Relacionado</FormLabel>
                  <FormControl>
                    <SelectOptions
                      placeholder="Selecione um ativo (opcional)"
                      options={assetsOptions}
                      {...field}
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
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
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
