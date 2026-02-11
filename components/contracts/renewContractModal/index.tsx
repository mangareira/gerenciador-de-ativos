import { DatePicker } from "@/components/datePicker";
import { Select } from "@/components/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate, handleCurrencyChange } from "@/lib/utils";
import { paymetFrequenceOptions } from "@/utils/constants/contract-options";
import { useUpdateContract } from "@/utils/hooks/contracts/useUpdateContract";
import { Contract, UpdateContract, UpdateContractSchema } from "@/utils/schemas/contracts.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, DollarSign, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const RenewContractModal = ({ contract } : {contract: Contract}) => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(UpdateContractSchema),
    defaultValues: {
      paymentFrequency: undefined,      
      endDate: undefined,
      value: undefined,
      notes: undefined,
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
          <RefreshCw className="mr-2 h-4 w-4" />
          Renovar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Renovar Contrato</DialogTitle>
          <DialogDescription>Defina os novos termos para renovacao do contrato.</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <h4 className="font-medium text-sm">{contract.title}</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="mr-1 h-3 w-3" />
              Vence em {formatDate(contract.endDate)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <DollarSign className="mr-1 h-3 w-3" />
              {formatCurrency(contract.value)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono">{contract.contractNumber}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Data de Termino</FormLabel>
                  <FormControl> 
                    <DatePicker disabled={isPending} {...field} /> 
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
                  <FormLabel>Novo Valor (R$)</FormLabel>
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observacoes da Renovacao</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notas sobre a renovacao..." 
                      className="resize-none" 
                      disabled={isPending} 
                      onKeyDown={(e) => e.stopPropagation()} 
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
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Renovando...</> : "Confirmar Renovacao"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
