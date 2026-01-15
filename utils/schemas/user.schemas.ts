// ============================================
// USER SCHEMAS
// ============================================

import z from "zod";
import { UserRoleSchema } from "./enums.schemas";

export const UserSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
  role: UserRoleSchema,
  department: z.string().min(1, "Departamento é obrigatório"),
  avatar: z.url("URL do avatar inválida").nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date<Date | string>(),
  updatedAt: z.coerce.date<Date | string>(),
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