import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { prisma } from "@/lib/prisma";
import { CreateTicketSchema, UpdateTicketSchema } from "@/utils/schemas/tickets.schemas";

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
  .get(
    "/get-by-id/:id",
    zValidator(
      "param",
      z.object({
        id: z.cuid()
      })
    ),
    async (c) => {
      try {
        
        const { id } = c.req.valid("param")
  
        const ticket = await prisma.ticket.findUnique({
          where: {
            id,
          },
          include: {
            asset: true,
            assignedTo: true,
            requester: true,
            comments: {
              include: {
                user: true,
              }
            }
          }
        })

        return c.json({ ticket }, 200)
      } catch  {
        return c.json({ error: "Chamado não existe" }, 404)
      }
    }
  )
  .put(
    "/update/:ticketId",
    zValidator(
      "param",
      z.object({
        ticketId: z.cuid()
      })
    ),
    zValidator(
      "json",
      UpdateTicketSchema
    ),
    async (c) => {
      try {
        
        const { ticketId: id } = c.req.valid("param")
  
        const values = c.req.valid("json")
  
        if(values.status == "resolved" || values.status == "closed" ) {
          values.resolvedAt = new Date()
        }
  
        await prisma.ticket.update({
          where: { id },
          data: {
            ...values,
            updatedAt: new Date()
          },
        })
  
        return c.json({ message: "Chamado atualizado com sucesso" }, 200)
      } catch  (error) {
        console.error("Erro ao atualizar ticket:", error)
        return c.json({ error: "Erro ao atualizar ticket" }, 400)  
      }
    }
  )

export default app