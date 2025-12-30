'use client'
import AddAssetModal from "@/components/assets/addAssetModal";
import AssetsCard from "@/components/assets/assetsCard";
import AssetsSkeleton from "@/components/assets/assetsSkeleton";
import SearchAssets from "@/components/assets/searchAssets";
import SummaryStatus from "@/components/assets/summaryStatus";
import { Button } from "@/components/ui/button";    
import { useGetAssets } from "@/utils/hooks/assets/useGetAssets";
import { useGetDepartments } from "@/utils/hooks/department/useGetDepartments";
import { useGetAllUsers } from "@/utils/hooks/user/useGetAllUsers";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export default function AssetsPage() {
  const { data: assets, isLoading } = useGetAssets();
  const { data: departments } = useGetDepartments();
  const { data: users } = useGetAllUsers()
  
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredAssets = useMemo(() => {
    if (!assets) return [];

    return assets.filter((asset) => {
      const matchesSearch = searchTerm === "" || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === "all" || asset.type === typeFilter;

      const matchesStatus = statusFilter === "all" || asset.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [assets, searchTerm, typeFilter, statusFilter]);

  const departmentOptions = (departments ?? []).map((department) => ({
    label: department.name,
    value: department.id,
  }));

  const assignedOptions = (users ?? []).map((user) => ({
    label: user.name,
    value: user.id
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ativos</h1>
          <p className="text-muted-foreground">
            Gerencie equipamentos e recursos de TI
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo ativo
        </Button>
      </div>
      
      <AddAssetModal 
        departmentOptions={departmentOptions}
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
      
      <SearchAssets 
        onSearchChange={setSearchTerm}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
      />
      {
        isLoading && !assets ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AssetsSkeleton />
            <AssetsSkeleton />
            <AssetsSkeleton />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <AssetsCard 
                    key={asset.id} 
                    asset={asset} 
                    departamentOptions={departmentOptions}
                    assignedOptions={assignedOptions}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhum ativo encontrado com os filtros aplicados.
                  </p>
                </div>
              )}
            </div>
            <SummaryStatus assets={filteredAssets} />
          </>
        )
      }
    </div>
  )
}