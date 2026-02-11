import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Contract } from "@/utils/schemas/contracts.schemas"
import { Mail, Phone, User } from "lucide-react"

export const ContactCard = ({ contract } : { contract: Contract }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Contato do Fornecedor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{contract.contactPerson}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${contract.contactEmail}`} className="text-sm text-primary hover:underline">{contract.contactEmail}</a>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${contract.contactPhone}`} className="text-sm text-primary hover:underline">{contract.contactPhone}</a>
        </div>
      </CardContent>
    </Card>
  )
}
