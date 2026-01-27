import { Asset } from "@/utils/schemas/assets.schemas"
import { Option } from "./options"

export interface MaintenanceModalProps {
  asset: Asset
  triggerButton?: React.ReactNode
  technicianOptions: Option[]
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