'use client'
import SearchTool from "@/components/search";
import { Button } from "@/components/ui/button";
import { UserSummary } from "@/components/users/summary";
import { UsersList } from "@/components/users/usersList";
import UsersSkeleton from "@/components/users/usersSkeleton";
import SummaryUsersSkeleton from "@/components/users/summary/summarySkeleton";
import { typeOptions } from "@/utils/constants/users-options-search";
import { useGetAllUsers } from "@/utils/hooks/user/useGetAllUsers";
import { UserPlus } from "lucide-react";
import { useMemo, useState } from "react";

export default function UsersPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");  

  const { data: users, isLoading } = useGetAllUsers()

  const filteredUsers = useMemo(() => { 
    if (!users) return [];
    
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || user.role === typeFilter

      return matchesSearch && matchesType
      }
    )
  }, [users, searchTerm, typeFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <SearchTool 
        onSearchChange={setSearchTerm}
        onTypeChange={setTypeFilter}
        typeOptions={typeOptions}
        titlePlaceholder="Buscar por nome, email ou departamento..."
      />

      {isLoading && !users ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <UsersSkeleton />
          <UsersSkeleton />
          <UsersSkeleton />
        </div>
      ) : (
        <UsersList users={filteredUsers} />
      )}

      {isLoading && !users ? (
        <SummaryUsersSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <UserSummary 
            title="Total de Usuários"
            count={filteredUsers.length}
          />
          <UserSummary 
            title="Administradores"
            count={filteredUsers.filter((u) => u.role === "admin").length}
          />
          <UserSummary 
            title="Técnicos"
            count={filteredUsers.filter((u) => u.role === "technician").length}
          />
          <UserSummary 
            title="Usuários Ativos"
            count={filteredUsers.filter((u) => u.isActive).length}
          />
        </div>
      )}
    </div>
  )
}