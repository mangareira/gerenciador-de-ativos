'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { ReactNode, useState } from "react"
import { useForm } from "react-hook-form"
import { Option } from "@/types/options"
import { useCreateLicense } from "@/utils/hooks/licenses/useCreateLicense"
import { CreateLicense, CreateLicenseSchema } from "@/utils/schemas/license.schemas"
import { Select } from "@/components/select"
import { LicenseTypeOptions } from "@/utils/constants/licenses-options-search"
import { DatePicker } from "@/components/datePicker"
import { Textarea } from "@/components/ui/textarea"

interface CreateLicenseProps {
  triggerButton?: ReactNode
  departamentsOptions?: Option[]
}

const CreateLicenseModal = ({
  triggerButton,
  departamentsOptions
}: CreateLicenseProps) => {

  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(CreateLicenseSchema),
    defaultValues: {
      annualCost: 0,
      licenseKey: "",
      licenseType: undefined,
      purchaseDate: new Date(),
      notes: "",
      softwareName: "",
      totalSeats: 0,
      vendor: "",
    }
  })

  const { mutate, isPending } = useCreateLicense()

  const onSubmit = async (data: CreateLicense) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false)
      },
    })

    form.reset()
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Licença
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Licença</DialogTitle>
          <DialogDescription>
            Registre uma nova licença de software no sistema.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="softwareName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Software *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Microsoft Office 365" 
                      disabled={isPending}
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
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Software *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Microsoft" 
                      disabled={isPending}
                      required 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licenseType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Licença *</FormLabel>
                    <FormControl>
                      <Select
                        options={LicenseTypeOptions}
                        placeholder="Selecione o tipo"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade de Licenças *</FormLabel>
                    <FormControl>
                      <Input 
                        disabled={isPending}
                        type="number"
                        min={1}
                        required 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="licenseKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chave da Licença *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="XXXXX-XXXXX-XXXXX-XXXXX" 
                      className="font-mono"
                      disabled={isPending}
                      required 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField 
                control={form.control} 
                name="purchaseDate" 
                render={({ field }) => ( 
                  <FormItem> 
                    <FormLabel >Data de Compra *</FormLabel> 
                    <FormControl> 
                      <DatePicker {...field} /> 
                    </FormControl> 
                  </FormItem> 
                )} 
              />
              <FormField 
                control={form.control} 
                name="expiryDate" 
                render={({ field }) => ( 
                  <FormItem> 
                    <FormLabel >Data de Expiração</FormLabel> 
                    <FormControl> 
                      <DatePicker {...field} /> 
                    </FormControl> 
                  </FormItem> 
                )} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="annualCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo Anual (R$) * </FormLabel>
                    <FormControl>
                      <Input 
                        disabled={isPending}
                        type="number"
                        min={1}
                        step={0.01}
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
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento *</FormLabel>
                    <FormControl>
                      <Select
                        options={departamentsOptions}
                        placeholder="Selecione o departamento"
                        {...field}
                      />
                    </FormControl>
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Salvando..." : "Adicionar Licença"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLicenseModal