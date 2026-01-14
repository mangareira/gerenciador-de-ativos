import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Asset } from "@/utils/schemas/assets.schemas"
import { MaintenanceModal } from "../maintenanceModal"
import { MaintenanceHistoryModal } from "../maintenanceHistoryModal"
import { AllocateAssetModal } from "../allocateAssetModal"
import AssetMovementHistoryModal from "../assetMovementHIstoryModal"
import CreateTicketModal from "@/components/ticket/createTicketModal"

function QuickActionsCard({ 
  asset, 
  technicianOptions, 
  assignedToOptions, 
  departamentOptions,
  assetsOptions
}:{
  asset: Asset, 
  technicianOptions: {
    label: string,
    value: string
  }[]
  assignedToOptions: {
    label: string,
    value: string
  }[]
  departamentOptions: {
    label: string,
    value: string
  }[]
  assetsOptions: {
    label: string
    value: string
  }[]
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