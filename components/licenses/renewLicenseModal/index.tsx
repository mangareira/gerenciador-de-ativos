import { DatePicker } from "@/components/datePicker"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, formatDate, handleCurrencyChange, handleSimpleNumberChange} from "@/lib/utils"
import { useRenewLicense } from "@/utils/hooks/licenses/useRenewLicense"
import { License, UpdateLicense, UpdateLicenseSchema } from "@/utils/schemas/license.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, DollarSign, Loader2, RefreshCw, Users } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

export const RenewLicenseModal = ({ license }:{ license: License }) => {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(UpdateLicenseSchema),
    defaultValues: {
      annualCost: 0,
      notes: "",
      totalSeats: 0,
      expiryDate: undefined
    }
  })

  const { mutate, isPending } = useRenewLicense(license.id)

  const onSubmit = (data: UpdateLicense) => {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Renovar Licença</DialogTitle>
          <DialogDescription>
            Renove a licença de {license.softwareName}
          </DialogDescription>
        </DialogHeader>

        {/* Current License Info */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <h4 className="font-medium text-sm">Informações Atuais</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Expira em:</span>
            </div>
            <span className="font-medium">
              {license.expiryDate ? formatDate(license.expiryDate) : "Perpétua"}
            </span>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Licenças:</span>
            </div>
            <span className="font-medium">
              {(license.users?.length || 0)}/{license.totalSeats} em uso
            </span>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Custo Atual:</span>
            </div>
            <span className="font-medium">{formatCurrency(license.annualCost)}/ano</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Data de Expiração *</FormLabel>
                  <FormControl>
                    <DatePicker {...field}/>
                  </FormControl>
                  <FormMessage  />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="annualCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo da Renovação (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        id="purchasePrice"
                        placeholder="0,00"
                        required
                        value={field.value ? formatCurrency(field.value) : ""}
                        onChange={(e) => handleCurrencyChange<UpdateLicense>("annualCost", e.target.value, form.setValue)}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Licenças Adicionais</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={isPending}
                        type="number"
                        required 
                        {...field} 
                        onChange={(e) => handleSimpleNumberChange<UpdateLicense>("totalSeats", e.target.value, form.setValue)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre a licença..."
                      className="resize-none"
                      onKeyDown={(e) => e.stopPropagation()}
                      rows={4}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Renovando...
                  </>
                ) : (
                  "Confirmar Renovação"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
