import SearchTool from "@/components/search"
import { Select } from "@/components/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormField } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { useGetAllUsers } from "@/utils/hooks/user/useGetAllUsers"
import { AllocateUserLicense, AllocateUserLicenseSchema, License } from "@/utils/schemas/license.schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UserMinus, UserPlus, Users } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

export const ManageAllocationsModal = ({ license } : { license: License }) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm({
    resolver: zodResolver(AllocateUserLicenseSchema),
    defaultValues: {
      userId: ""
    }
  })

  const { data: users } = useGetAllUsers()

  const usersOptions = (users ?? []).map((user) => ({
    label: user.name,
    value: user.id
  }))

  const filteredAllocatedUsers = useMemo(() => {
    if(!license.users) return []

    return license.users.filter((user) => {
      const matchesSearch = searchTerm === "" || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [searchTerm, license.users])

  const utilizationPercent = Math.round(((license.users?.length || 0) / license.totalSeats) * 100)
  const availableSeats = license.totalSeats - (license.users?.length || 0)

  const handleAllocate = (data: AllocateUserLicense) => {
    console.log(data);
  }

  const handleDeallocate = (userId: string) => {
    console.log(userId);
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Users className="mr-2 h-4 w-4" />
          Gerenciar Alocações
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerenciar Alocações de Licença</DialogTitle>
          <DialogDescription>{license.softwareName}</DialogDescription>
        </DialogHeader>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Utilização</span>
            <span className="text-sm text-muted-foreground">
              {(license.users?.length || 0)} de {license.totalSeats} ({utilizationPercent}%)
            </span>
          </div>
          <Progress value={utilizationPercent} className="h-2" />
          <div className="flex gap-4 text-sm">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {availableSeats} disponíveis
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {(license.users?.length || 0)} em uso
            </Badge>
          </div>
        </div>
        {availableSeats > 0 && (
          <Form {...form} >
              <form onSubmit={form.handleSubmit(handleAllocate)} className="flex gap-2">
                <FormField 
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <Select 
                      placeholder="Selecione um usuário para alocar..."
                      options={usersOptions}
                      {...field}
                    />
                  )}
                />
                <Button>
                  {false ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Alocar
                    </>
                  )}
                </Button>
              </form>
            </Form>
        )}
        {availableSeats === 0 && (
          <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-800">
            Todas as licenças estão em uso. Remova uma alocação ou renove com licenças adicionais.
          </div>
        )}
        <div className="relative">
          <SearchTool 
            titlePlaceholder="Buscar usuários alocados..."
            onSearchChange={setSearchTerm}
          />
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {filteredAllocatedUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">
                {searchTerm ? "Nenhum usuário encontrado" : "Nenhuma alocação ainda"}
              </p>
            </div>
          ) : (
            filteredAllocatedUsers.map((user) => {
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.department}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeallocate(user.id)}
                    // disabled={isDeallocating}
                  >
                    {false ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <UserMinus className="mr-1 h-4 w-4" />
                        Remover
                      </>
                    )}
                  </Button>
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
