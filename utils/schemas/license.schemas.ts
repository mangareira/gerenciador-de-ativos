import z from "zod";
import { LicenseTypeSchema } from "./enums.schemas";
import { DepartmentSchema } from "./department.schemas";
import { UserSchema } from "./user.schemas";

export const LicenseSchema = z.object({
  id: z.cuid(),
  softwareName: z.string(),
  vendor: z.string(),
  licenseType: LicenseTypeSchema,
  licenseKey: z.string(),
  totalSeats: z.number(),
  purchaseDate: z.coerce.date<Date>(),
  expiryDate: z.coerce.date<Date>().optional().nullable(),
  annualCost: z.number(),
  departmentId: z.string(),
  department: DepartmentSchema,
  users: UserSchema.array().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date<Date>(),
  updatedAt: z.coerce.date<Date>()
})

export type  License = z.infer<typeof LicenseSchema>

export const CreateLicenseSchema = z.object({
  softwareName: z.string(),
  vendor: z.string(),
  licenseType: LicenseTypeSchema,
  licenseKey: z.string(),
  totalSeats: z.number(),
  purchaseDate: z.coerce.date<Date>(),
  expiryDate: z.coerce.date<Date>().optional(),
  annualCost: z.number(),
  departmentId: z.string(),
  notes: z.string().optional(),
})

export type CreateLicense = z.infer<typeof CreateLicenseSchema>
