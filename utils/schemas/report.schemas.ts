import z from "zod";
import { AssetSchema } from "./assets.schemas";
import { LicenseSchema } from "./license.schemas";
import { ContractSchema } from "./contracts.schemas";
import { TicketSchema } from "./tickets.schemas";
import { DepartmentSchema } from "./department.schemas";

export const ReportSchema = z.object({
  assets: AssetSchema.array(),
  licenses: LicenseSchema.array(),
  contracts: ContractSchema.array(),
  tickets: TicketSchema.array(),
  departments: DepartmentSchema.array()
})

export type Report = z.infer<typeof ReportSchema>