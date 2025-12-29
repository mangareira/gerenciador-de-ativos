import z from "zod";

export const allocateAssetSchema = z.object({
  assignedToId: z.cuid().optional().nullable(),
  departmentId: z.cuid().optional(),
  location: z.string().optional(),
  movementDate: z.coerce.date<Date>().optional(),
  notes: z.string().optional()
})

export type AllocateAsset = z.infer<typeof allocateAssetSchema>