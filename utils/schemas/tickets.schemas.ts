import z from "zod";
import { AssetSchema } from "./assets.schemas";
import { UserSchema } from "./user.schemas";
import { TicketCommentSchema } from "./comment.schemas";
import { TicketCategoryTypeSchema, TicketPriorityTypeSchema, TicketStatusTypeSchema } from "./enums.schemas";

export const TicketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: TicketCategoryTypeSchema,
  priority: TicketPriorityTypeSchema,
  status: TicketStatusTypeSchema,
  requesterId: z.cuid(),
  requester: UserSchema,
  assignedToId: z.cuid().nullable().optional(),
  assignedTo: UserSchema.nullable().optional(),
  assetId: z.cuid().nullable().optional(),
  asset: AssetSchema.omit({
    movements: true,
    assignedTo: true,
    department: true
  }).nullable().optional(),
  createdAt: z.coerce.date<Date>(),
  updatedAt: z.coerce.date<Date>(),
  resolvedAt: z.coerce.date<Date>().nullable().optional(),
  resolution: z.string().nullable().optional(),
  estimatedResolutionDate: z.coerce.date<Date>().nullable().optional(),
  comments: TicketCommentSchema.array().nullable().optional()
})

export type Ticket = z.infer<typeof TicketSchema>

export const CreateTicketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: TicketCategoryTypeSchema,
  priority: TicketPriorityTypeSchema,
  requesterId: z.cuid(),
  assignedToId: z.cuid().optional(),
  assetId: z.cuid().optional(),
  estimatedResolutionDate: z.coerce.date<Date>().nullable().optional()
})

export type CreateTicket = z.infer<typeof CreateTicketSchema>

export const UpdateTicketSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: TicketCategoryTypeSchema.optional(),
  priority: TicketPriorityTypeSchema.optional(),
  status: TicketStatusTypeSchema.optional(),
  assignedToId: z.cuid().optional(),
  assetId: z.cuid().optional(),
  resolution: z.string().nullable().optional(),
  resolvedAt: z.coerce.date<Date>().nullable().optional(),
  estimatedResolutionDate: z.coerce.date<Date>().nullable().optional()
})

export type UpdateTicket = z.infer<typeof UpdateTicketSchema>