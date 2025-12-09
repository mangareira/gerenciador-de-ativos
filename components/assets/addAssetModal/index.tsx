'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/datePicker";
import { DynamicSpecifications } from "@/components/ui/dynamic-specifications";
import { Select as SelectOptions } from "@/components/select";
import { useCreateAsset } from "@/utils/hooks/assets/useCreateAssets";
import { CreateAsset, CreateAssetSchema } from "@/utils/schemas/assets.schemas";
import { useCreateMovementHistory } from "@/utils/hooks/movementHistory/useCreateMovementHistory";

interface AddAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentOptions: { value: string; label: string }[];
}

export default function AddAssetModal({ open, onOpenChange, departmentOptions }: AddAssetModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const { mutate } = useCreateAsset();
  const { mutate: createMovement } = useCreateMovementHistory()
  
  const form = useForm<CreateAsset>({
    resolver: zodResolver(CreateAssetSchema),
    defaultValues: {
      status: "available",
      type: "desktop",
      name: "",
      manufacturer: "",
      model: "",
      serialNumber: "",
      specifications: {},
      purchaseDate: undefined,
      warrantyExpiry: undefined,
      purchasePrice: undefined,
      currentValue: undefined,
      notes: "",
      location: "",
    }
  })

  const onSubmit = async (data: CreateAsset) => {
    setIsLoading(true);

    mutate(data, {
      onSuccess: ( res ) => {

        if (res && 'error' in res && res.error) {
          console.error(res.error);
          setIsLoading(false);
          return;
        }
        if( 'asset' in res) {
          const asset = res.asset

          createMovement({
            assetId: asset.id,
            authorizedBy: "Jose da silva", //TODO: botar o nome do login
            fromLocation: asset.location,
            movementDate: new Date(),
            reason: "Ativo registrado no sistema",
            type: "creation",
          })
        }

        setIsLoading(false);
        onOpenChange(false);
      },
      onError: () => {
        setIsLoading(false);
      }
    });
  };

  const handleNumberChange = (fieldName: keyof CreateAsset, value: string) => {
    const numericValue = value === "" ? 0 : Number(value);
    form.setValue(fieldName, numericValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ativo</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo ativo de TI
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Adicionar Ativo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
