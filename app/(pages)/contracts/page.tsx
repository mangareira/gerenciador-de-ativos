'use client'

import { ContractListCard } from "@/components/contracts/contractListCard";
import { SummaryContracts } from "@/components/contracts/summary";
import ContractListSkeleton from "@/components/contracts/contractListSkeleton";
import SummarySkeleton from "@/components/contracts/summarySkeleton";
import SearchTool from "@/components/search"
import { Button } from "@/components/ui/button"
import { statusOptions, typeOptions } from "@/utils/constants/contract-options";
import { useGetAllContracts } from "@/utils/hooks/contracts/useGetAllContracts";
import { Plus } from "lucide-react"
import { useMemo, useState } from "react";

export default function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");  
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: contracts, isLoading } = useGetAllContracts()

  
  const filteredContracts = useMemo(() => {
    if (!contracts) return []
    return contracts.filter((contract) => {
      const matchesSearch =
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase())
  
      const matchesType = typeFilter === "all" || contract.type === typeFilter
      const matchesStatus = statusFilter === "all" || contract.status === statusFilter
  
      return matchesSearch && matchesType && matchesStatus
    })
  }, [contracts, searchTerm, statusFilter, typeFilter]) 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">Gerencie contratos de manutenção, suporte e leasing</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      <SearchTool 
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        titlePlaceholder="Buscar por título, fornecedor ou número do contrato..."
      />

      {isLoading ? (
        <ContractListSkeleton />
      ) : (
        <ContractListCard contracts={filteredContracts} />
      )}

      {isLoading ? <SummarySkeleton /> : <SummaryContracts contracts={filteredContracts} />}
    </div>
  )
}
