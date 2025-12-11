import { DatePicker } from "@/components/datePicker"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MaintenanceModalProps } from "@/types/maintence-props"
import { CreateMaintenance, createMaintenanceSchema } from "@/utils/schemas/maintenance.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Select as SelectOptions } from "@/components/select"
import { Wrench } from "lucide-react"
import { useCreateMaintenance } from "@/utils/hooks/maintenance/useCreateMaintenance"
import { useCreateMovementHistory } from "@/utils/hooks/movementHistory/useCreateMovementHistory"


export const MaintenanceModal = ({ asset,triggerButton, technicianOptions }: MaintenanceModalProps) => {
  const [open, setOpen] = useState(false)

  const form = useForm<CreateMaintenance>({
    resolver: zodResolver(createMaintenanceSchema),
    defaultValues: {
      maintenanceType: "preventive",
      maintenanceDate: new Date(),
      nextMaintenance: undefined,
      technicianId: "",
      cost: 0,
      description: "",
      notes: "",
      assetId: asset.id
    },
  })

  const { mutate } = useCreateMaintenance()
  const { mutate: createMovement } = useCreateMovementHistory();
  

  const onSubmit = async (data: CreateMaintenance) => {
    mutate(data, {
      onSuccess: (maintenance) => {
        if('maintenance' in  maintenance) {
          const main = maintenance.maintenance

          createMovement({
            assetId: main.assetId,
            type: "maintenance",
            authorizedBy: "Sistema",
            fromLocation: asset.location,
            movementDate: new Date(),
            reason: 
              main.maintenanceType == 'preventive' ? 
                "Manutenção preventiva realizada" :

                main.maintenanceType == 'corrective' ?
                  "Manutenção corretiva realizada" :

                  main.maintenanceType == 'cleaning' ?
                    "Manuteção de limpeza realizada" :

                    main.maintenanceType == 'upgrade' ?
                      "Manuteção para fazer upgrade do ativo" :
                      "Inspeção realizada",
            notes: main.description,
            technicianId: main.technicianId
          })
        }
      }
    })

    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Wrench className="mr-2 h-4 w-4" />
            Registrar Manutenção
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Manutenção</DialogTitle>
          <DialogDescription>
            {asset ? `Registre uma manutenção para ${asset.name}` : "Registre uma manutenção no ativo"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="maintenanceType"
                render={({ field }) => (
                  <FormItem>
                    <Label>Tipo de Manutenção *</Label>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value} 
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preventive">Preventiva</SelectItem>
                          <SelectItem value="corrective">Corretiva</SelectItem>
                          <SelectItem value="upgrade">Upgrade</SelectItem>
                          <SelectItem value="cleaning">Limpeza</SelectItem>
                          <SelectItem value="inspection">Inspeção</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maintenanceDate"
                render={({ field }) => (
                  <FormItem>
                    <Label>Data da Manutenção *</Label>
                    <FormControl>
                      <DatePicker 
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nextMaintenance"
                render={({ field }) => (
                  <FormItem>
                    <Label>Proxima Manutenção</Label>
                    <FormControl>
                      <DatePicker 
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <Label>Técnico Responsável *</Label>
                      <FormControl> 
                        <SelectOptions
                          options={technicianOptions}
                          placeholder="Selecione um Técnico"
                          value={field.value}
                          onChange={field.onChange}
                        /> 
                      </FormControl> 
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <Label>Custo</Label>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
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
                    <Label>Descrição *</Label>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o que foi realizado na manutenção..."
                        rows={4} 
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
                    <Label>Peças Substituídas</Label>
                    <FormControl>
                      <Textarea 
                        placeholder="Liste as peças substituídas (opcional)..." 
                        rows={2} 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Registrar Manutenção"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
