import { z } from "zod"
import { MaintenanceTypeSchema } from "./enums.schemas"
import { UserSchema } from "./user.schemas"

export const maintenanceSchema = z.object({
  id: z.cuid(),
  maintenanceType: MaintenanceTypeSchema,
  maintenanceDate: z.date(),
  nextMaintenance: z.date().nullable(),
  technicianId: z.cuid().nullable(),
  technician: UserSchema.nullable(),
  assetId: z.cuid(),
  cost: z.number().nullable(),
  description: z.string(),
  notes: z.string().nullable(),
  createdAt: z.date()
})  

export type Maintenance = z.infer<typeof maintenanceSchema>

export const createMaintenanceSchema = z.object({
  maintenanceType: MaintenanceTypeSchema,
  maintenanceDate: z.coerce.date<Date>(),
  nextMaintenance: z.coerce.date<Date>().optional(),
  technicianId: z.cuid(),
  assetId: z.cuid(),
  cost: z.coerce.number<number | undefined>().min(0, "O custo deve ser maior ou igual a zero").optional(),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  notes: z.string().optional(),
})  

export type CreateMaintenance = z.infer<typeof createMaintenanceSchema>
