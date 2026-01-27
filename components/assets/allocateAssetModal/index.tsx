"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { User } from "lucide-react"
import { Asset } from "@/utils/schemas/assets.schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Select } from "@/components/select"
import { AllocateAsset, allocateAssetSchema } from "@/utils/schemas/allocateAsset.schemas"
import { DatePicker } from "@/components/datePicker"
import { useEditAssetSubmit } from "@/utils/hooks/assets/useEditAssetSubmit"
import { Option } from "@/types/options"

interface AllocateAssetModalProps {
  asset: Asset
  triggerButton?: React.ReactNode
  departmentOptions: Option[]
  assignedToOptions: Option[]
}

export function AllocateAssetModal({ 
  asset, 
  triggerButton, 
  assignedToOptions,
  departmentOptions
}: AllocateAssetModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { handleSubmit: allocateSubmit } = useEditAssetSubmit({
    asset, 
    departmentOptions,
    assignedToOptions,
    onSuccess: () => {
      setOpen(false)
    }
  })

  const form = useForm<AllocateAsset>({
    resolver: zodResolver(allocateAssetSchema),
    defaultValues: {
      assignedToId: asset?.assignedToId,
      departmentId: asset?.departmentId,
      location: asset?.location,
      movementDate: new Date()
    }
  })

  const handleSubmit = async (data: AllocateAsset) => {
    allocateSubmit({
      assignedToId: data.assignedToId,
      departmentId: data.departmentId,
      location: data.location,
    }, 
      setLoading, 
      data.notes
    )
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <User className="mr-2 h-4 w-4" />
            Alocar/Mover
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alocar/Mover Ativo</DialogTitle>
          <DialogDescription>
            {asset ? `Configure a alocação para ${asset.name}` : "Configure a alocação do ativo"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>  
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="assignedToId"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Usuário Responsável</Label>
                      <FormControl>
                        <Select
                          options={assignedToOptions}
                          placeholder="Selecione um Usuário"
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
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Departamento</Label>
                      <FormControl>
                        <Select
                          options={departmentOptions}
                          placeholder="Selecione um Usuário"
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
                  name="location" 
                  render={({ field }) => ( 
                  <FormItem> 
                    <Label htmlFor="location">Localização</Label> 
                    <FormControl> 
                      <Input 
                        id="location" 
                        placeholder="Ex: Sala 201, Prédio A" 
                        required
                        onKeyDown={(e) => {
                          e.stopPropagation()
                        }}
                        {...field} 
                      /> 
                    </FormControl> 
                  </FormItem> )} 
                />
              </div>
              <div className="space-y-2">
                <FormField 
                  control={form.control}
                  name="movementDate"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Data da Movimentação</Label>
                      <FormControl>
                        <DatePicker {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2" >
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Motivo/Observações</Label>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva o motivo da movimentação..." 
                          rows={3}
                          onKeyDown={(e) => {
                            e.stopPropagation()
                          }}
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processando..." : "Confirmar Alocação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
