import { z } from "zod";

// ============================================
// ENUMS
// ============================================

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

// ============================================
// USER SCHEMAS
// ============================================

export const UserSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
  role: UserRoleSchema,
  department: z.string().min(1, "Departamento é obrigatório"),
  avatar: z.url("URL do avatar inválida").nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
  role: UserRoleSchema,
  department: z.string().min(1, "Departamento é obrigatório"),
  avatar: z.url("URL do avatar inválida").nullable().optional(),
  isActive: z.boolean().default(true).optional(),
});
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.email("Email inválido").optional(),
  role: UserRoleSchema.optional(),
  department: z.string().min(1, "Departamento é obrigatório").optional(),
  avatar: z.url("URL do avatar inválida").nullable().optional(),
  isActive: z.boolean().optional(),
});
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

// ============================================
// DEPARTMENT SCHEMAS
// ============================================

export const DepartmentSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  costCenter: z.string().min(1, "Centro de custo é obrigatório"),
  managerId: z.cuid(),
  location: z.string().min(1, "Localização é obrigatória"),
});
export type Department = z.infer<typeof DepartmentSchema>;

export const CreateDepartmentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  costCenter: z.string().min(1, "Centro de custo é obrigatório"),
  managerId: z.cuid(),
  location: z.string().min(1, "Localização é obrigatória"),
});
export type CreateDepartment = z.infer<typeof CreateDepartmentSchema>;

export const UpdateDepartmentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  costCenter: z.string().min(1, "Centro de custo é obrigatório").optional(),
  managerId: z.cuid().optional(),
  location: z.string().min(1, "Localização é obrigatória").optional(),
});
export type UpdateDepartment = z.infer<typeof UpdateDepartmentSchema>;

// ============================================
// ASSET SCHEMAS
// ============================================

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
  assignedToId: z.cuid().nullable().optional(),
  location: z.string().min(1, "Localização é obrigatória"),
  specifications: z.record(z.string(), z.any()),
  notes: z.string().nullable().optional(),
  lastMaintenanceDate: z.date().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Asset = z.infer<typeof AssetSchema>;

export const CreateAssetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: AssetTypeSchema,
  status: AssetStatusSchema.default("available"),
  serialNumber: z.string().min(1, "Número de série é obrigatório"),
  manufacturer: z.string().min(1, "Fabricante é obrigatório"),
  model: z.string().min(1, "Modelo é obrigatório"),
  purchaseDate: z.coerce.date(),
  warrantyExpiry: z.coerce.date(),
  purchasePrice: z.number().positive("Preço de compra deve ser positivo"),
  currentValue: z.number().nonnegative("Valor atual deve ser não-negativo"),
  departmentId: z.cuid(),
  assignedToId: z.cuid().nullable().optional(),
  location: z.string().min(1, "Localização é obrigatória"),
  specifications: z.record(z.string(), z.any()).default({}),
  notes: z.string().nullable().optional(),
  lastMaintenanceDate: z.coerce.date().nullable().optional(),
});
export type CreateAsset = z.infer<typeof CreateAssetSchema>;

export const UpdateAssetSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  type: AssetTypeSchema.optional(),
  status: AssetStatusSchema.optional(),
  serialNumber: z.string().min(1, "Número de série é obrigatório").optional(),
  manufacturer: z.string().min(1, "Fabricante é obrigatório").optional(),
  model: z.string().min(1, "Modelo é obrigatório").optional(),
  purchaseDate: z.coerce.date().optional(),
  warrantyExpiry: z.coerce.date().optional(),
  purchasePrice: z.number().positive("Preço de compra deve ser positivo").optional(),
  currentValue: z.number().nonnegative("Valor atual deve ser não-negativo").optional(),
  departmentId: z.cuid().optional(),
  assignedToId: z.cuid().nullable().optional(),
  location: z.string().min(1, "Localização é obrigatória").optional(),
  specifications: z.record(z.string(), z.any()).optional(),
  notes: z.string().nullable().optional(),
  lastMaintenanceDate: z.coerce.date().nullable().optional(),
});
export type UpdateAsset = z.infer<typeof UpdateAssetSchema>;
