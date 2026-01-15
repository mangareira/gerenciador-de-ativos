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
  .get(
    "/get-all",
    async (c) => {
      try {
        const tickets = await prisma.ticket.findMany({
          orderBy: {
            createdAt: "desc"
          },
          include: {
            asset: true,
            assignedTo: true,
            requester: true,
          }
        })
        
        return c.json({ tickets }, 200)
      } catch  {
        return c.json({ error: "Error as buscar chamados" }, 404)
      }
    }
  )

export default app