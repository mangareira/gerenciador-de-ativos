// ============================================
// ENUMS
// ============================================

import z from "zod";

export const UserRoleSchema = z.enum(["admin", "manager", "technician", "user"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const AssetTypeSchema = z.enum([
  "desktop",
  "laptop",
  "server",
  "network",
  "mobile",
  "printer",
  "other",
]);
export type AssetType = z.infer<typeof AssetTypeSchema>;

export const AssetStatusSchema = z.enum([
  "available",
  "in_use",
  "maintenance",
  "retired",
  "lost",
]);
export type AssetStatus = z.infer<typeof AssetStatusSchema>;

export const AssetMovementTypeSchema = z.enum([
  "allocation",
  "maintenance", 
  "transfer", 
  "creation"
])

export type AssetMovementType = z.infer<typeof AssetMovementTypeSchema>

export const MaintenanceTypeSchema = z.enum([
  "preventive", 
  "corrective", 
  "upgrade", 
  "cleaning", 
  "inspection"
])

export type MaintenanceType = z.infer<typeof MaintenanceTypeSchema> 

export const TicketPriorityTypeSchema = z.enum([
  "low",
  "medium",
  "high",
  "critical"
])

export type TicketPriorityType = z.infer<typeof TicketPriorityTypeSchema>

export const TicketStatusTypeSchema = z.enum([
  "open",
  "in_progress",
  "pending",
  "resolved",
  "closed"
])

export type TicketStatusType = z.infer<typeof TicketStatusTypeSchema>

export const TicketCategoryTypeSchema = z.enum([
   "hardware",
   "software",
   "network",
   "access",
   "other"
])

export type TicketCategoryType = z.infer<typeof TicketCategoryTypeSchema>