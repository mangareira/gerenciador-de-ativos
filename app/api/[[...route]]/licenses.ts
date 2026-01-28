import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { prisma } from "@/lib/prisma";
import { CreateLicenseSchema } from "@/utils/schemas/license.schemas";

const app = new Hono()
  .post(
    "/create",
    zValidator(
      "json",
      CreateLicenseSchema
    ),
    async (c) => {
      const values = c.req.valid('json')

      try {
        const license = await prisma.license.create({
          data: {
            ...values
          }
        })

        if(!license) {
          return c.json({ error: "Erro ao criar licença" }, 400)
        }

        return c.json({ license }, 201)
      } catch (error) {
        console.error("Erro ao criar licença:", error)
        return c.json({ error: "Erro ao criar licença" }, 400)
      }

    }
  )
  .get(
    "/get-all",
    async (c) => {
      try {
        const licenses = await prisma.license.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            department: true,
            users: true,
          }
        })

        return c.json({ licenses }, 200)
      } catch  {
        return c.json({ error: "Erro ao buscar licenças" }, 404)
      }
    }
  )
  .get(
    "/get-by-id/:id",
    zValidator(
      "param",
      z.object({ id: z.cuid() })
    ),
    async (c) => {
      try {
        const { id } = c.req.valid("param")

        const license = await prisma.license.findUnique({
          where: { id },
          include: { department: true, users: true }
        })

        return c.json({ license }, 200)
      } catch  {
        return c.json({ error: "Licença não existe" }, 404)
      }
    }
  )

export default app
