import { DatePicker } from "@/components/datePicker"
import { Select } from "@/components/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, handleCurrencyChange, handleSimpleNumberChange } from "@/lib/utils"
import { paymetFrequenceOptions, typeOptions } from "@/utils/constants/contract-options"
import { useUpdateContract } from "@/utils/hooks/contracts/useUpdateContract"
import { Contract, UpdateContract, UpdateContractSchema } from "@/utils/schemas/contracts.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const EditContractModal = ({ contract } : {contract: Contract}) => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(UpdateContractSchema),
    defaultValues: {
      ...contract,
      notes: undefined
    }
  })

  const { mutate, isPending } = useUpdateContract(contract.id)

  const onSubmit = (data: UpdateContract) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Contrato</DialogTitle>
          <DialogDescription>Edite as informacoes do contrato {contract.contractNumber}.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Titulo do Contrato</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} onKeyDown={(e) => e.stopPropagation()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Select
                          placeholder="Selecione o tipo de contrato."
                          options={typeOptions.filter(o => o.value !== 'all')}
                          {...field}
                        />
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} onKeyDown={(e) => e.stopPropagation()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero do Contrato</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} onKeyDown={(e) => e.stopPropagation()} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0,00"
                        disabled={isPending}
                        {...field}
                        value={field.value ? formatCurrency(field.value) : ""}
                        onChange={(e) => handleCurrencyChange<UpdateContract>("value", e.target.value, form.setValue)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequencia de Pagamento</FormLabel>
                      <FormControl>
                        <Select 
                          placeholder="Selecione a frequencia do pagamento."
                          options={paymetFrequenceOptions}
                          {...field}                        
                        />
                      </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Inicio</FormLabel>
                    <FormControl> 
                      <DatePicker disabled={isPending} {...field} /> 
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Termino</FormLabel>
                    <FormControl> 
                      <DatePicker disabled={isPending} {...field} /> 
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notificationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notificar antes (dias)</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={isPending}
                        type="number"
                        min={1}
                        step={1}
                        required 
                        {...field} 
                        onChange={(e) => handleSimpleNumberChange<UpdateContract>("notificationDays", e.target.value, form.setValue)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="autoRenew"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer">Auto-renovacao</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-medium mb-3">Informacoes de Contato</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} onKeyDown={(e) => e.stopPropagation()} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} onKeyDown={(e) => e.stopPropagation()} type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} onKeyDown={(e) => e.stopPropagation()} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observacoes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending} className="bg-transparent">Cancelar</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : "Salvar Alteracoes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
