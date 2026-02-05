import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TabsContent } from '@/components/ui/tabs'
import { formatDate, getLicenseDetails, getLicenseTypeLabel } from '@/lib/utils'
import { License } from '@/utils/schemas/license.schemas'
import { Building2, Calendar, Check, Copy, FileKey, Users } from 'lucide-react'
import { useState } from 'react'

export const LicenseOverviewTab = ({ license } : { license: License }) => {
  const [copied, setCopied] = useState(false)
 
  const { isExpiring, renewalDate, utilizationPercent } = getLicenseDetails(license)
  
  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(license.licenseKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TabsContent value="overview" className="space-y-4 mt-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Utilização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Licenças em uso</span>
            <span className="font-medium">
              {license.users?.length} de {license.totalSeats}
            </span>
          </div>
          <Progress value={utilizationPercent} className="h-3" />
          <div className="flex justify-between text-sm">
            <Badge
              variant="secondary"
              className={
                utilizationPercent >= 90
                  ? "bg-red-100 text-red-800"
                  : utilizationPercent >= 70
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
              }
            >
              {utilizationPercent}% utilizado
            </Badge>
            <span className="text-muted-foreground">
              {license.totalSeats - (license.users?.length || 0)} disponíveis
            </span>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileKey className="h-4 w-4" />
              Chave da Licença
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono bg-muted px-2 py-1 rounded truncate">
                {license.licenseKey}
              </code>
              <Button variant="ghost" size="icon" onClick={handleCopyKey}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Departamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="font-medium">{license.department?.name || "-"}</div>
              <div className="text-muted-foreground">
                Centro de Custo: {license.department?.costCenter || "-"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dates */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Datas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Compra</div>
              <div className="font-medium">{formatDate(license.purchaseDate)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Expiração</div>
              <div className={`font-medium ${isExpiring ? "text-yellow-600" : ""}`}>
                {license.expiryDate ? formatDate(license.expiryDate) : "Perpétua"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Renovação</div>
              <div className="font-medium">
                {renewalDate ? formatDate(renewalDate) : "-"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type & Notes */}
      <div className={`grid ${license.notes ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tipo de Licença</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-sm">
              {getLicenseTypeLabel(license.licenseType)}
            </Badge>
          </CardContent>
        </Card>

        {license.notes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{license.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TabsContent>
  )
}
