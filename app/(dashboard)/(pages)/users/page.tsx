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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetDepartments } from "@/utils/hooks/department/useGetDepartments";
import { AddUserModal } from "@/components/users/addUserModal";

export default function UsersPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: users, isLoading } = useGetAllUsers()
  const { data: departments } = useGetDepartments()


  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "all" || user.role === typeFilter

      return matchesSearch && matchesType
    })
  }, [users, searchTerm, typeFilter])

  const departmentOptions = (departments ?? []).map((department) => ({
    label: department.name,
    value: department.id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
          <p className="text-muted-foreground">Gerencie usuários, departamentos e permissões</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-end">
            <AddUserModal departmentOptions={departmentOptions} />
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
            <UsersList users={filteredUsers} departmentOptions={departmentOptions} />
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
        </TabsContent>
      </Tabs>
    </div>
  )
}