import { Asset } from "@/utils/schemas/assets.schemas"

export interface MaintenanceModalProps {
  asset: Asset
  triggerButton?: React.ReactNode
  technicianOptions: {
    label: string
    value: string
  }[]
}

export interface MaintenanceRecord {
  id: string
  assetId: string
  maintenanceType: "preventive" | "corrective" | "upgrade" | "inspection" | "cleaning"
  description: string
  technicianId: string
  maintenanceDate: Date
  cost: number
  nextMaintenance?: Date
  notes?: string
  createdAt: Date
}