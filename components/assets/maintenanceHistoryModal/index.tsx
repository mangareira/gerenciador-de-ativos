"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wrench, Calendar, DollarSign } from "lucide-react"
import { Asset } from "@/utils/schemas/assets.schemas"
import { useGetMaintenance } from "@/utils/hooks/maintenance/useGetMaintenance"
import { formatCurrency, formatDate } from "@/lib/utils"
import { SummaryCard } from "./summaryCard"
import { MaintenanceTimiline } from "./maintenanceTimeline"

interface MaintenanceHistoryModalProps {
  asset: Asset
}


export function MaintenanceHistoryModal({ asset }: MaintenanceHistoryModalProps) {
  const [open, setOpen] = useState(false)

  // Filter maintenance records for this asset
  const {data: maintenanceHistory = []} = useGetMaintenance(asset.id)


  const totalMaintenanceCost = maintenanceHistory.reduce((sum, record) => sum + (record.cost || 0 ), 0)
  const totalMaintenances = maintenanceHistory.length
  const lastMaintenance = maintenanceHistory[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          <Wrench className="mr-2 h-4 w-4" />
          Histórico de Manutenções
        </Button>
      </DialogTrigger>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>Histórico de Manutenções</DialogTitle>
          <DialogDescription>Histórico completo de manutenções realizadas no ativo {asset.name}</DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <SummaryCard
            title="Total Manutenções"
            Icon={Wrench}
          >
            {totalMaintenances}
          </SummaryCard>
          <SummaryCard
            title="Custo Total"
            className="text-xl font-bold"
            Icon={DollarSign}
          >
            {formatCurrency(totalMaintenanceCost)}
          </SummaryCard>
          <SummaryCard
            title="Última Manutenção"
            Icon={Calendar}
            className="text-sm font-medium"
          >
            {lastMaintenance ? formatDate(lastMaintenance.maintenanceDate) : "N/A"}
          </SummaryCard>
        </div>

        <MaintenanceTimiline maintenanceHistory={maintenanceHistory} />
      </DialogContent>
    </Dialog>
  )
}
