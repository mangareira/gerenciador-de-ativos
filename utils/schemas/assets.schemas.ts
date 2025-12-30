import z from "zod";
import { AssetStatusSchema, AssetTypeSchema } from "./enums.schemas";
import { DepartmentSchema } from "./department.schemas";
import { UserSchema } from "./user.schemas";
import { AssetMovementSchema } from "./assetsMovementHistory.schemas";

export const AssetSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  type: AssetTypeSchema,
  status: AssetStatusSchema,
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  purchaseDate: z.date(),
  warrantyExpiry: z.date(),
  purchasePrice: z.number().positive("Preço de compra deve ser positivo"),
  currentValue: z.number().nonnegative("Valor atual deve ser não-negativo"),
  departmentId: z.cuid(),
  department: DepartmentSchema,
  assignedToId: z.cuid().nullable().optional(),
  assignedTo: UserSchema.omit({
    id: true
  }).nullable(),
  location: z.string().min(1, "Localização é obrigatória"),
  specifications: z.record(z.string(), z.any()),
  notes: z.string().nullable().optional(),
  lastMaintenanceDate: z.date().nullable().optional(),
  movements: AssetMovementSchema.array(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Asset = z.infer<typeof AssetSchema>;

export const CreateAssetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: AssetTypeSchema,
  status: AssetStatusSchema,
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  purchaseDate: z.union([z.date(), z.string()]),
  warrantyExpiry: z.union([z.date(), z.string()]),
  purchasePrice: z.number().positive("Preço de compra deve ser positivo"),
  currentValue: z.number().nonnegative("Valor atual deve ser não-negativo"),
  departmentId: z.cuid(),
  assignedToId: z.cuid().nullable().optional(),
  location: z.string().min(1, "Localização é obrigatória"),
  specifications: z.record(z.string(), z.any()),
  notes: z.string().nullable().optional(),
  lastMaintenanceDate: z.union([z.date(), z.string()]).nullable().optional(),
});
export type CreateAsset = z.infer<typeof CreateAssetSchema>;

export const UpdateAssetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  type: AssetTypeSchema.optional(),
  status: AssetStatusSchema.optional(),
  serialNumber: z.string().min(1, "Número de série é obrigatório").optional(),
  manufacturer: z.string().min(1, "Fabricante é obrigatório").optional(),
  model: z.string().min(1, "Modelo é obrigatório").optional(),
  purchaseDate: z.union([z.date(), z.string()]).optional(),
  warrantyExpiry: z.union([z.date(), z.string()]).optional(),
  purchasePrice: z.number().positive("Preço de compra deve ser positivo").optional(),
  currentValue: z.number().nonnegative("Valor atual deve ser não-negativo").optional(),
  departmentId: z.cuid().optional(),
  assignedToId: z.cuid().nullable().optional(),
  location: z.string().min(1, "Localização é obrigatória").optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  notes: z.string().nullable().optional(),
  lastMaintenanceDate: z.coerce.date<Date>().nullable().optional(),
});
export type UpdateAsset = z.infer<typeof UpdateAssetSchema>;
