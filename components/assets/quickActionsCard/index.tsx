import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Asset } from "@/utils/schemas/assets.schemas"
import { MaintenanceModal } from "../maintenanceModal"
import { MaintenanceHistoryModal } from "../maintenanceHistoryModal"
import { AllocateAssetModal } from "../allocateAssetModal"
import AssetMovementHistoryModal from "../assetMovementHIstoryModal"
import CreateTicketModal from "@/components/ticket/createTicketModal"
import { Option } from "@/types/options"

function QuickActionsCard({ 
  asset, 
  technicianOptions, 
  assignedToOptions, 
  departamentOptions,
  assetsOptions
}:{
  asset: Asset, 
  technicianOptions: Option[]
  assignedToOptions: Option[]
  departamentOptions: Option[]
  assetsOptions: Option[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <MaintenanceModal asset={asset} technicianOptions={technicianOptions} />
        <MaintenanceHistoryModal asset={asset} />
        <AllocateAssetModal 
          asset={asset} 
          assignedToOptions={assignedToOptions}
          departmentOptions={departamentOptions}
        />
        <AssetMovementHistoryModal asset={asset} /> 
        <CreateTicketModal 
          asset={asset} 
          variant="outline" 
          assetsOptions={assetsOptions}
        />
      </CardContent>
    </Card>
  )
}

export default QuickActionsCard