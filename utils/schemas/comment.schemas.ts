import z from "zod";
import { UserSchema } from "./user.schemas";

export const TicketCommentSchema = z.object({
  id: z.cuid(),
  ticketId: z.cuid(),
  userId: z.cuid(),
  user: UserSchema,
  comment: z.string(),
  isInternal: z.boolean(),
  createdAt: z.coerce.date<Date>()
})

export type TicketComment = z.infer<typeof TicketCommentSchema>

export const CreateTicketCommentSchema = z.object({
  ticketId: z.cuid(),
  userId: z.cuid(),
  comment: z.string().min(1),
  isInternal: z.boolean(),
})

export type CreateTicketComment = z.infer<typeof CreateTicketCommentSchema>