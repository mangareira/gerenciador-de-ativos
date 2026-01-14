import z from "zod";

export const TicketCommentSchema = z.object({
  id: z.cuid(),
  ticketId: z.cuid(),
  userId: z.cuid(),
  comment: z.string(),
  isInternal: z.boolean(),
  createdAt: z.coerce.date<Date>()
})