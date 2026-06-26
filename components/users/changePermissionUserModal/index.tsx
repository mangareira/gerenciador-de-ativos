import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ROLE_OPTIONS } from "@/lib/utils";
import { useUpdateUser } from "@/utils/hooks/user/useUpdateUser"
import { UpdateUser, UpdateUserSchema, User } from "@/utils/schemas/user.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield, UserIcon } from "lucide-react";
import { useState } from "react"
import { useForm } from "react-hook-form";

interface UserModalProps {
  user: User
  triggerButton?: React.ReactNode
}

export const ChangePermissionUserModal = ({ user, triggerButton }: UserModalProps) => {
  const [open, setOpen] = useState(false)
  const { mutate, isPending } = useUpdateUser(user.id)

  const form = useForm<UpdateUser>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      role: user.role,
      isActive: user.isActive,
    },
  })

  const onSubmit = async (data: UpdateUser) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <UserIcon className="mr-2 h-4 w-4" />
            Alterar Permissões
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Alterar Permissões
          </DialogTitle>
          <DialogDescription>
            {user ? `Defina o nível de acesso de ${user.name}.` : "Defina o nível de acesso do usuário."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função / Nível de Acesso</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {ROLE_OPTIONS.find((o) => o.value === field.value)?.description}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Usuário Ativo</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Usuários inativos não conseguem acessar o sistema.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
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
                  "Salvar Permissões"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
