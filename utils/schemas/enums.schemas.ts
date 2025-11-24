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