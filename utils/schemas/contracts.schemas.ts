import z from "zod";
import { AssetSchema } from "./assets.schemas";
import { ContractPaymentTypeSchema, ContractStatusSchema, ContractTypeSchema } from "./enums.schemas";

export const ContractSchema = z.object({
  id: z.cuid(),
  title: z.string(),
  vendor: z.string(),
  type: ContractTypeSchema,
  status: ContractStatusSchema,
  contractNumber: z.string(),
  startDate: z.coerce.date<Date>(),
  endDate: z.coerce.date<Date>(),
  value: z.coerce.number<number>(),
  paymentFrequency: ContractPaymentTypeSchema,
  autoRenew: z.boolean().default(false),
  notificationDays: z.coerce.number<number>(),
  contactPerson: z.string(),
  contactEmail: z.email(),
  contactPhone: z.string(),
  contractAssets: AssetSchema.array(),
  notes: z.string().nullable().optional(),
  createdAt: z.coerce.date<Date>(),
  updatedAt: z.coerce.date<Date>()
})

export type Contract = z.infer<typeof ContractSchema>

export const CreateContractSchema = z.object({
  title: z.string(),
  vendor: z.string(),
  type: ContractTypeSchema,
  status: ContractStatusSchema,
  contractNumber: z.string(),
  startDate: z.coerce.date<Date>(),
  endDate: z.coerce.date<Date>(),
  value: z.coerce.number<number>(),
  paymentFrequency: ContractPaymentTypeSchema,
  autoRenew: z.boolean().optional(),
  notificationDays: z.coerce.number<number>(),
  contactPerson: z.string(),
  contactEmail: z.email(),
  contactPhone: z.string(),
  notes: z.string().optional(),
})

export type CreateContract = z.infer<typeof CreateContractSchema>

export const UpdateContractSchema = z.object({
  title: z.string().optional(),
  vendor: z.string().optional(),
  type: ContractTypeSchema.optional(),
  status: ContractStatusSchema.optional(),
  contractNumber: z.string().optional(),
  startDate: z.coerce.date<Date>().optional(),
  endDate: z.coerce.date<Date>().optional(),
  value: z.coerce.number<number>().optional(),
  paymentFrequency: ContractPaymentTypeSchema.optional(),
  autoRenew: z.boolean().optional(),
  notificationDays: z.coerce.number<number>().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.email().optional(),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
})

export type UpdateContract = z.infer<typeof UpdateContractSchema>
