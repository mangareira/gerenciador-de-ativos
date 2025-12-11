import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Asset } from "@/utils/schemas/assets.schemas"
import { FileText } from "lucide-react"
import { MaintenanceModal } from "../maintenanceModal"
import { MaintenanceHistoryModal } from "../maintenanceHistoryModal"

function QuickActionsCard({ asset, technicianOptions }:{
  asset: Asset, 
  technicianOptions: {
    label: string,
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
        {/* <AllocateAssetModal asset={asset} /> */}
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <FileText className="mr-2 h-4 w-4" />
          Criar Chamado
        </Button>
      </CardContent>
    </Card>
  )
}

export default QuickActionsCard