import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* <MaintenanceModal asset={asset} />
        <AllocateAssetModal asset={asset} /> */}
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <FileText className="mr-2 h-4 w-4" />
          Criar Chamado
        </Button>
      </CardContent>
    </Card>
  )
}

export default QuickActionsCard