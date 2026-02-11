import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { FileText } from "lucide-react"

export const ContractNotes = ({ contract } : { contract: Contract }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Observacoes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{contract.notes}</p>
      </CardContent>
    </Card>
  )
}
