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