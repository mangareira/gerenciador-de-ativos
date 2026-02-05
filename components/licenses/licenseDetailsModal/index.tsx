import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getLicenseDetails, getLicenseStatusColor, getStatusLabel } from "@/lib/utils"
import { License } from "@/utils/schemas/license.schemas"
import { AlertTriangle, Eye, FileKey } from "lucide-react"
import { useState } from "react"
import { LicenseTabs } from "./licenseTabs"

export const LicenseDetailsModal = ({ license } : { license: License }) => {
  const [open, setOpen] = useState(false)

  const { isExpiring, daysUntilExpiry } = getLicenseDetails(license)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-transparent">
          <Eye className="mr-2 h-4 w-4" />
          Ver Detalhes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] sm:max-h-[86.5vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <FileKey className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl">{license.softwareName}</DialogTitle>
                <p className="text-sm text-muted-foreground">{license.vendor}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={getLicenseStatusColor(license.status)}>
                {getStatusLabel(license.status)}
              </Badge>
              {isExpiring && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Expira em {daysUntilExpiry} dias
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <LicenseTabs license={license}/>
      </DialogContent>
    </Dialog>
  )
}
