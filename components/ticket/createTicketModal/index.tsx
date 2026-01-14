import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Asset } from "@/utils/schemas/assets.schemas"
import { CreateTicket, CreateTicketSchema } from "@/utils/schemas/tickets.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Loader2, Plus } from "lucide-react"
import { ReactNode, useState } from "react"
import { useForm } from "react-hook-form"
import { Select as SelectOptions } from "@/components/select"
import { useCreateTicket } from "@/utils/hooks/tickets/useCreateTicket"

interface CreateTicketProps {
  asset?: Asset
  variant?: "outline" | "default"
  triggerButton?: ReactNode
  assetsOptions?: {
    label: string
    value: string
  }[]
}

const CreateTicketModal = ({
  asset,
  triggerButton,
  variant,
  assetsOptions
}: CreateTicketProps) => {

  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const form = useForm<CreateTicket>({
    resolver: zodResolver(CreateTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      priority: undefined,
      assetId: asset?.id,
      requesterId: "cmj0cgrhy0000vaoo7zimheo9"
    }
  })

  const { mutate } = useCreateTicket()

  const onSubmit = async (data: CreateTicket) => {
    setLoading(true)

    mutate(data, {
      onSuccess: () => {
        setOpen(false)
      },
    })

    form.reset()
    setLoading(false)
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant={variant} className={variant === "outline" ? "w-full justify-start bg-transparent" : ""}>
            {variant === "outline" ? (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Criar Chamado
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Novo Chamado
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Chamado</DialogTitle>
          <DialogDescription>
            {asset
              ? `Registrar um chamado para o ativo: ${asset.name}`
              : "Preencha as informações abaixo para registrar um novo chamado de suporte"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Chamado*</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Notebook não liga após atualização" 
                      disabled={isLoading}
                      required 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Detalhada*</FormLabel>
                  <Textarea
                    {...field}
                    placeholder="Descreva o problema com o máximo de detalhes possível..."
                    rows={5}
                    disabled={isLoading}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria*</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade*</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="critical">Crítica</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ativo Relacionado {asset ? "" : "(Opcional)"}</FormLabel>
                  <FormControl>
                    <SelectOptions
                      placeholder="Selecione um ativo (se aplicável)"
                      options={assetsOptions}
                      disable={!!asset?.id}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Criando..." : "Criar Chamado"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTicketModal