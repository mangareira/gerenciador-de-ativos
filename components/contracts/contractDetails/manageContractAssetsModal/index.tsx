import SearchTool from "@/components/search"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { assetStatusColors, getStatusLabel } from "@/lib/utils"
import { useGetAssets } from "@/utils/hooks/assets/useGetAssets"
import useManageAssetAllocateToContract from "@/utils/hooks/contracts/useManageAssetAllocateToContract"
import { AllocateAssetToContract, Contract } from "@/utils/schemas/contracts.schemas"
import { HardDrive, Laptop, Monitor, Package, Plus, Printer, Server, Smartphone, Wifi, X } from "lucide-react"
import { useMemo, useState } from "react"

const assetTypeIcons: Record<string, React.ReactNode> = {
  desktop: <Monitor className="h-4 w-4" />,
  laptop: <Laptop className="h-4 w-4" />,
  server: <Server className="h-4 w-4" />,
  network: <Wifi className="h-4 w-4" />,
  mobile: <Smartphone className="h-4 w-4" />,
  printer: <Printer className="h-4 w-4" />,
  other: <HardDrive className="h-4 w-4" />,
}

export const ManageContractAssetsModal = ({ contract } : { contract: Contract }) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");

  const { data: assets } = useGetAssets()

  const { mutate } = useManageAssetAllocateToContract(contract.id)

const filteredAssets = useMemo(() => {
  if (!assets || !contract?.contractAssets) return [];

  const allocatedAssetIds = new Set(
    contract.contractAssets.map(asset => asset.id)
  );

  return assets.filter((asset) => {
    if (allocatedAssetIds.has(asset.id)) return false;

    const matchesSearch = searchTerm === "" || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });
}, [assets, contract.contractAssets, searchTerm]);

  const onSubmit = (data: AllocateAssetToContract) => {
    mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Package className="mr-2 h-4 w-4" />
          Gerenciar Ativos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Ativos do Contrato</DialogTitle>
          <DialogDescription>
            Adicione ou remova ativos cobertos pelo contrato{" "}
            <span className="font-mono font-medium">{contract.contractNumber}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">
              Ativos Vinculados ({contract.contractAssets.length})
            </h4>
            {contract.contractAssets.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum ativo vinculado</p>
                <p className="text-xs mt-1">
                  Use a busca abaixo para adicionar ativos
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {contract.contractAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded-lg bg-muted">
                        <AvatarFallback className="rounded-lg bg-muted text-muted-foreground">
                          {assetTypeIcons[asset.type] || (
                            <HardDrive className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {asset.manufacturer} {asset.model} &middot;{" "}
                          <span className="font-mono">{asset.serialNumber}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${assetStatusColors[asset.status] || ""}`}
                      >
                        {getStatusLabel(asset.status)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onSubmit({ assetId: asset.id, allocateType: "deallocate" })}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remover ativo</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Adicionar Ativos</h4>
            <div className="relative mb-3">
              <SearchTool 
                onSearchChange={setSearchTerm}
                titlePlaceholder="Buscar por nome, serial, fabricante..."
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 rounded-lg border p-2">
              {filteredAssets.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  <p className="text-sm">
                    {searchTerm
                      ? "Nenhum ativo encontrado"
                      : "Todos os ativos ja estao vinculados"}
                  </p>
                </div>
              ) : (
                filteredAssets.map((asset) => (
                  <button
                    type="button"
                    key={asset.id}
                    className="flex items-center justify-between w-full rounded-lg p-3 text-left hover:bg-muted/50 transition-colors"
                    onClick={() => onSubmit({ assetId: asset.id, allocateType: "allocate" })}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                        {assetTypeIcons[asset.type] || (
                          <HardDrive className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {asset.manufacturer} {asset.model} &middot;{" "}
                          <span className="font-mono">{asset.serialNumber}</span>
                        </p>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-primary" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
