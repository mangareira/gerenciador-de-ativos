import { prisma } from "@/lib/prisma";
import { CreateTicketSchema } from "@/utils/schemas/tickets.schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
  .post(
    "/create",
    zValidator(
      "json",
      CreateTicketSchema
    ),
    async (c) => {

      const values = c.req.valid('json')

      const ticket = await prisma.ticket.create({
        data: {
          ...values,
          status: "open"
        }
      })

      if(!ticket) {
        return c.json({ error: "Erro ao cria chamado" }, 400)
      }

      return c.json({ ticket }, 201)

    }
  )

export default app