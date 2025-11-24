// ============================================
// ASSET MOVEMENT SCHEMAS
// ============================================

import z from "zod";
import { AssetMovementTypeSchema } from "./enums.schemas";
import { UserSchema } from "./user.schemas";

export const AssetMovementSchema = z.object({
  id: z.cuid(),
  assetId: z.cuid(),
  type: AssetMovementTypeSchema,
  fromUserId: z.cuid().optional().nullable(),
  toUserId: z.cuid().optional().nullable(),
  fromLocation: z.string(),
  toLocation: z.string().optional().nullable(),
  movementDate: z.date(),
  reason: z.string(),
  authorizedBy: z.string(),
  notes: z.string().optional().nullable(),
  technicianId: z.cuid().optional().nullable(),
  fromUser: UserSchema.optional(),
  toUser: UserSchema.optional(),
  technician: UserSchema.optional(),
});
export type AssetMovement = z.infer<typeof AssetMovementSchema>;

export const CreateAssetMovementSchema = z.object({
  assetId: z.cuid(),
  type: AssetMovementTypeSchema,
  fromUserId: z.cuid().optional().nullable(),
  toUserId: z.cuid().optional().nullable(),
  fromLocation: z.string(),
  toLocation: z.string().optional().nullable(),
  movementDate: z.union([z.date(), z.string()]),
  reason: z.string().min(1, "Motivo é obrigatório"),
  authorizedBy: z.string().min(1, "Autorizado por é obrigatório"),
  notes: z.string().optional().nullable(),
  technicianId: z.cuid().optional().nullable()
});
export type CreateAssetMovement = z.infer<typeof CreateAssetMovementSchema>;