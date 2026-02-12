import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { Package } from "lucide-react"
import Link from "next/link"
import { ManageContractAssetsModal } from "../../manageContractAssetsModal"
import { getStatusLabel } from "@/lib/utils"

export const RelatedAssets = ({ contract } : { contract: Contract }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Ativos Relacionados ({contract.contractAssets.length})
        </CardTitle>
        <ManageContractAssetsModal
          contract={contract}
        />
      </CardHeader>
      <CardContent>
        {contract.contractAssets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto opacity-20 mb-2" />
            <p className="text-sm">Nenhum ativo vinculado a este contrato</p>
            <ManageContractAssetsModal
              contract={contract}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {contract.contractAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.manufacturer} {asset.model} - {asset.serialNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize">{getStatusLabel(asset.status)}</Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/assets/${asset.id}`}>Ver</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
