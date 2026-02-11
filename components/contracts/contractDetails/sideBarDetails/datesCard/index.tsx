import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { Clock } from "lucide-react"

export const DatesCard = ({ contract } : { contract: Contract }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Datas do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent  className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Criado em:</span>
          <span>{formatDate(contract.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Atualizado em:</span>
          <span>{formatDate(contract.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
