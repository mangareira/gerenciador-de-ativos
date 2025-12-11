import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate, maintenanceTypeColors, maintenanceTypeLabels } from "@/lib/utils"
import { Maintenance } from "@/utils/schemas/maintenance.schemas"
import { Calendar, FileText, TrendingUp, User, Wrench } from "lucide-react"

export const MaintenanceTimiline = ({
  maintenanceHistory
} : {
  maintenanceHistory: Maintenance[]
}) => {
  return (
    <>
      {maintenanceHistory.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Linha do Tempo</h3>
          <div className="space-y-4">
            {maintenanceHistory.map((record, index) => (
              <div
                key={record.id}
                className={`flex gap-4 pb-4 ${index !== maintenanceHistory.length - 1 ? "border-b" : ""}`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full p-2 ${
                      record.maintenanceType === "preventive"
                        ? "bg-blue-100"
                        : record.maintenanceType === "corrective"
                          ? "bg-orange-100"
                          : record.maintenanceType === "upgrade"
                            ? "bg-purple-100"
                            : record.maintenanceType === "inspection" 
                            ? "bg-green-100"
                            : "bg-red-100"
                    }`}
                  >
                    {record.maintenanceType === "upgrade" ? (
                      <TrendingUp className="h-4 w-4 text-purple-800" />
                    ) : (
                      <Wrench
                        className={`h-4 w-4 ${
                          record.maintenanceType === "preventive"
                            ? "text-blue-800"
                            : record.maintenanceType === "corrective"
                              ? "text-orange-800"
                                : record.maintenanceType === "inspection"
                                ? "text-green-800"
                                : "text-red-800"
                        }`}
                      />
                    )}
                  </div>
                  {index !== maintenanceHistory.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={maintenanceTypeColors[record.maintenanceType]}>
                          {maintenanceTypeLabels[record.maintenanceType]}
                        </Badge>
                        {(record.cost || 0) > 0 && (
                          <span className="text-sm font-semibold text-primary">{formatCurrency((record.cost || 0))}</span>
                        )}
                      </div>
                      <h4 className="font-semibold">{record.description}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(record.maintenanceDate)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>Realizado por: {record.technician?.name}</span>
                    </div>

                    {record.nextMaintenance && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Próxima manutenção: {formatDate(record.nextMaintenance)}</span>
                      </div>
                    )}

                    {record.notes && (
                      <div className="flex items-start gap-2 text-muted-foreground mt-2">
                        <FileText className="h-3 w-3 mt-0.5" />
                        <span className="flex-1">{record.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma manutenção registrada</h3>
          <p className="text-muted-foreground">Este ativo ainda não possui histórico de manutenções.</p>
        </div>
      )}
    </>
  )
}
