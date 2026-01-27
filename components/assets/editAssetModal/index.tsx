"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Edit } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "@/components/datePicker"
import { Select as SelectOptions } from "@/components/select";
import { DynamicSpecifications } from "@/components/ui/dynamic-specifications"
import { Asset, UpdateAsset, UpdateAssetSchema } from "@/utils/schemas/assets.schemas"
import { useEditAssetSubmit } from "@/utils/hooks/assets/useEditAssetSubmit"

interface EditAssetModalProps {
  asset: Asset
  departmentOptions: { value: string; label: string }[]
  triggerButton?: React.ReactNode
}

export function EditAssetModal({ asset, departmentOptions, triggerButton }: EditAssetModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<UpdateAsset>({
    resolver: zodResolver(UpdateAssetSchema),
    defaultValues: asset
  })

  const { handleSubmit: editSubmit } = useEditAssetSubmit({
    asset,
    departmentOptions,
    onSuccess: () => setOpen(false),
  })

  const handleSubmit = async (data: UpdateAsset) => {
    setLoading(true)

    editSubmit(data, setLoading)

    setLoading(false)
    setOpen(false)
  }

  const handleNumberChange = (fieldName: keyof UpdateAsset, value: string) => {
    const numericValue = value === "" ? 0 : Number(value);
    form.setValue(fieldName, numericValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Ativo</DialogTitle>
          <DialogDescription>Atualize as informações do ativo</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Nome *</Label>
                      <FormControl>
                        <Input 
                          id="name" 
                          placeholder="Ex: Notebook Dell Latitude" 
                          required 
                          {...field}
                        />
                      </FormControl>  
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField 
                  control={form.control} 
                  name="type" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <Label htmlFor="type">Tipo *</Label> 
                      <FormControl> 
                        <Select 
                          required
                          onValueChange={field.onChange} 
                          value={field.value}
                        > 
                          <SelectTrigger id="type"> 
                            <SelectValue placeholder="Selecione o tipo" /> 
                          </SelectTrigger> 
                          <SelectContent> 
                            <SelectItem value="desktop">Desktop</SelectItem> 
                            <SelectItem value="laptop">Notebook</SelectItem> 
                            <SelectItem value="server">Servidor</SelectItem> 
                            <SelectItem value="network">Equipamento de Rede</SelectItem> 
                            <SelectItem value="mobile">Dispositivo Móvel</SelectItem> 
                            <SelectItem value="printer">Impressora</SelectItem> 
                            <SelectItem value="other">Outro</SelectItem> 
                          </SelectContent> 
                        </Select> 
                      </FormControl> 
                    </FormItem> 
                  )} 
                /> 
              </div> 
              <div className="space-y-2"> 
                <FormField 
                  control={form.control}
                  name="manufacturer" 
                  render={({ field }) => ( 
                    <FormItem>
                      <Label htmlFor="manufacturer">Fabricante *</Label>
                      <FormControl> 
                        <Input 
                          id="manufacturer" 
                          placeholder="Ex: Dell, HP, Lenovo" 
                          required 
                          {...field} 
                        /> 
                      </FormControl>
                    </FormItem> 
                  )} 
                />
              </div> 
              <div className="space-y-2">
                <FormField 
                  control={form.control} 
                  name="model" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <Label htmlFor="model">Modelo *</Label> 
                      <FormControl> 
                        <Input 
                          id="model" 
                          placeholder="Ex: Latitude 5420" 
                          required 
                          {...field} /> 
                      </FormControl> 
                    </FormItem> 
                  )} 
                /> 
              </div> 
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="serialNumber" 
                  render={({ field }) => ( 
                  <FormItem> 
                    <Label htmlFor="serialNumber">Número de Série *</Label> 
                    <FormControl> 
                      <Input 
                        id="serialNumber" 
                        placeholder="Ex: ABC123XYZ456" 
                        required {...field} 
                      /> 
                    </FormControl> 
                  </FormItem> )} 
                /> 
              </div>
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="status" 
                  render={({ field }) => ( 
                  <FormItem> 
                    <Label htmlFor="status">Status *</Label> 
                    <FormControl> 
                      <Select 
                        required 
                        onValueChange={field.onChange} 
                        value={field.value}
                      > 
                        <SelectTrigger id="status"> 
                          <SelectValue placeholder="Selecione o status" /> 
                        </SelectTrigger> 
                        <SelectContent> 
                          <SelectItem value="available">Disponível</SelectItem> 
                          <SelectItem value="in_use">Em Uso</SelectItem> 
                          <SelectItem value="maintenance">Manutenção</SelectItem> 
                          <SelectItem value="retired">Aposentado</SelectItem> 
                          <SelectItem value="lost">Perdido</SelectItem> 
                        </SelectContent> 
                      </Select> 
                    </FormControl> 
                  </FormItem> 
                )} 
                />
              </div>
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="location" 
                  render={({ field }) => ( 
                  <FormItem> 
                    <Label htmlFor="location">Localização *</Label> 
                    <FormControl> 
                      <Input 
                        id="location" 
                        placeholder="Ex: Sala 201, Prédio A" 
                        required
                        {...field} 
                      /> 
                    </FormControl> 
                  </FormItem> )} 
                />
              </div>
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="purchaseDate" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <Label htmlFor="purchaseDate">Data de Compra *</Label> 
                      <FormControl> 
                        <DatePicker 
                          value={typeof field.value === "string" ? new Date(field.value) : field.value} 
                          onChange={field.onChange} 
                        /> 
                      </FormControl> 
                    </FormItem> 
                  )} 
                />
              </div>
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="warrantyExpiry" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <Label htmlFor="warrantyExpiry">Garantia até *</Label> 
                      <FormControl> 
                        <DatePicker 
                          value={typeof field.value === "string" ? new Date(field.value) : field.value} 
                          onChange={field.onChange} 
                        /> 
                      </FormControl> 
                    </FormItem> 
                  )} 
                />
              </div>
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="purchasePrice" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <Label htmlFor="purchasePrice">Preço de Compra (R$) *</Label> 
                      <FormControl> 
                        <Input 
                          id="purchasePrice" 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          required 
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberChange("purchasePrice", e.target.value)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        /> 
                      </FormControl> 
                    </FormItem> 
                  )} 
                />
              </div>
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="currentValue" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <Label htmlFor="currentValue">Valor Atual (R$) *</Label> 
                      <FormControl> 
                        <Input 
                          id="currentValue" 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          required 
                          value={field.value ?? ""}
                          onChange={(e) => handleNumberChange("currentValue", e.target.value)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        /> 
                      </FormControl> 
                    </FormItem> 
                  )} 
                />
              </div>
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="departmentId" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <Label htmlFor="departmentId">Departamento *</Label> 
                      <FormControl> 
                        <SelectOptions
                          options={departmentOptions}
                          placeholder="Selecione um departamento"
                          value={field.value}
                          onChange={field.onChange}
                        /> 
                      </FormControl> 
                    </FormItem> 
                  )} 
                />
              </div>
              <div className="space-y-2"> 
                <FormField 
                  control={form.control} 
                  name="notes" 
                  render={({ field }) => ( 
                    <FormItem> 
                      <Label htmlFor="notes">Observações</Label> 
                      <FormControl> 
                        <Textarea 
                          id="notes" 
                          placeholder="Informações adicionais sobre o ativo..." 
                          rows={3} 
                          {...field} 
                          value={field.value ?? ""} 
                        /> 
                      </FormControl> 
                    </FormItem> 
                  )} 
                />
              </div>

              <div className="space-y-2">
                <FormItem>
                  <Label>Especificações</Label>
                  <FormControl>
                    <DynamicSpecifications />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
