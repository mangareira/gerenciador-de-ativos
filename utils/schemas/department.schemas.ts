// ============================================
// DEPARTMENT SCHEMAS
// ============================================

import z from "zod";

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