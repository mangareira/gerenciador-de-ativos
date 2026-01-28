'use client'
import CreateLicenseModal from "@/components/licenses/createLicenseModal";
import { LicenseCard } from "@/components/licenses/licenseCard";
import LicenseCardSkeleton from "@/components/licenses/licenseCard/licenseCardSkeleton";
import { SummaryLicense } from "@/components/licenses/summary";
import { SummaryLicenseSkeleton } from "@/components/licenses/summary/summarySkeleton";
import SearchTool from "@/components/search"
import { statusOptions, typeOptions } from "@/utils/constants/licenses-options-search";
import { useGetDepartments } from "@/utils/hooks/department/useGetDepartments";
import { useGetAllLicenses } from "@/utils/hooks/licenses/useGetAllLicenses";
import { useState } from "react";

export default function LicensesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");  
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: departments } = useGetDepartments();

  const { data: licenses, isLoading } = useGetAllLicenses()
  
  const departmentOptions = (departments ?? []).map((department) => ({
    label: department.name,
    value: department.id,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Licenças de Software</h1>
          <p className="text-muted-foreground">Gerencie licenças e subscrições</p>
        </div>
        <CreateLicenseModal departamentsOptions={departmentOptions}/>
      </div>
      <SearchTool 
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onTypeChange={setTypeFilter}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        titlePlaceholder="Buscar por software, fornecedor ou chave..."
      />


      {
        isLoading && !licenses 
        ? 
        <>
          <LicenseCardSkeleton />
          <SummaryLicenseSkeleton />
        </>
        : 
          <>
            <LicenseCard licenses={licenses || []}  />
            <SummaryLicense licenses={licenses || []} />
          </>
      }
    </div>
  )
}
