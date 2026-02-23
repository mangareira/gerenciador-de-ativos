import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"
import { Asset } from "@/utils/schemas/assets.schemas"
import { Calendar, History, MapPin, Package, User, Wrench } from "lucide-react"
import { useState } from "react"

const AssetMovementHistoryModal = ({ asset, triggerButton }:{ 
  asset: Asset   
  triggerButton?: React.ReactNode 
}) => {
  const [open, setOpen] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case "allocation":
        return <User className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "transfer":
        return <MapPin className="h-4 w-4" />
      case "creation":
        return <Package className="h-4 w-4" />
      default:
        return <History className="h-4 w-4" />
    }
  }

  const getColorClass = (type: string, isCurrent?: boolean) => {
    if (isCurrent) return "border-primary"
    switch (type) {
      case "allocation":
        return "border-blue-500"
      case "maintenance":
        return "border-orange-500"
      case "transfer":
        return "border-purple-500"
      case "creation":
        return "border-muted"
      default:
        return "border-muted"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <History className="mr-2 h-4 w-4" />
            Ver Histórico Completo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Histórico do Ativo</DialogTitle>
          <DialogDescription>
            Linha do tempo completa com todas as movimentações e eventos registrados para {asset.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{asset.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {asset.manufacturer} {asset.model}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {asset.type}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <span className="text-muted-foreground">Série:</span>
                <p className="font-mono">{asset.serialNumber}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Localização Atual:</span>
                <p>{asset.location}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Linha do Tempo
            </h4>

            <div className="space-y-4">
              {asset.movements ? asset.movements.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 border-l-2 ${getColorClass(item.type, index == 0)} pl-4 pb-4 ${
                    index === (asset.movements?.length ?? 0) - 1 ? "border-l-transparent" : ""
                  }`}
                >
                  <div className="mt-1 rounded-full bg-background border p-1.5">{getIcon(item.type)}</div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{item.reason}</p>
                      {index == 0 && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Atual
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{item.fromLocation}</span>
                    </div>

                    {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.movementDate)}
                      </span>
                      {item.technician && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.technician.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )) : null}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{asset.movements?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Total de Eventos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {asset.movements?.filter((i) => i.type === "maintenance").length ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Manutenções</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {asset.movements?.filter((i) => i.type === "transfer").length ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Transferências</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AssetMovementHistoryModal