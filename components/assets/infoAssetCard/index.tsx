import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate, getAssetStatusColor, getStatusLabel } from "@/lib/utils"
import { Asset } from "@/utils/schemas/assets.schemas"
import { Calendar, DollarSign, FileText, MapPin, Package, User } from "lucide-react"

const InfoAssetCard = ({asset}: {asset: Asset} ) => {
  return (  
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Informações Gerais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Identificação</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ID do Ativo:</span>
                <span className="font-mono text-sm">{asset.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Número de Série:</span>
                <span className="font-mono text-sm">{asset.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <span className="text-sm capitalize">{asset.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge variant="outline" className={getAssetStatusColor(asset.status)}>
                  {getStatusLabel(asset.status)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Datas</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Compra:</span>
                <span className="text-sm">{formatDate(asset.purchaseDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Garantia expira:</span>
                <span className="text-sm">{formatDate(asset.warrantyExpiry)}</span>
              </div>
              {asset.lastMaintenanceDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Última manutenção:</span>
                  <span className="text-sm">{formatDate(asset.lastMaintenanceDate)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Valores</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor de Compra:</span>
                <span className="text-sm font-medium">{formatCurrency(asset.purchasePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Atual:</span>
                <span className="text-sm font-semibold text-primary">{formatCurrency(asset.currentValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Depreciação:</span>
                <span className="text-sm text-red-600">
                  -{Math.round(((asset.purchasePrice - asset.currentValue) / asset.purchasePrice) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Localização</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Departamento:</span>
                <span className="text-sm font-medium">{asset.department?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Centro de Custo:</span>
                <span className="text-sm font-mono">{asset.department?.costCenter}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Local:</span>
                <span className="text-sm">{asset.location}</span>
              </div>
            </div>
          </div>
        </div>
        {asset.assignedTo && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <User className="h-4 w-4" />
              <span>Usuário Alocado</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{asset.assignedTo?.name}</div>
                <div className="text-sm text-muted-foreground">{asset.assignedTo?.email}</div>
              </div>
              <Button variant="outline" size="sm">
                Ver Perfil
              </Button>
            </div>
          </div>
        )}
        {asset.notes && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              <span>Observações</span>
            </div>
            <p className="text-sm">{asset.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default InfoAssetCard
