import { prisma } from "@/lib/prisma";
import { CreateTicketCommentSchema } from "@/utils/schemas/comment.schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
  .post(
    "/create",
    zValidator(
      "json",
      CreateTicketCommentSchema
    ),
    async (c) => {

      try {
        
        const values = c.req.valid("json")
  
        const comment = await prisma.ticketComment.create({
          data: values
        })
  
        return c.json({ comment }, 201)
      
      } catch (error) {
        console.error("Erro ao criar comentario:", error)
        return c.json({ error: "Erro ao criar comentario" }, 400)  
      }
    }
  )

export default app