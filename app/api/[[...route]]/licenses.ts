import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { prisma } from "@/lib/prisma";
import { AllocateUserLicenseSchema, CreateLicenseSchema } from "@/utils/schemas/license.schemas";

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
  .put(
    "/allocate/:licenseId",
    zValidator(
      "param",
      z.object({
        licenseId: z.string()
      })
    ),
    zValidator(
      "json",
      AllocateUserLicenseSchema
    ),
    async (c) => {
      try {
        const data = c.req.valid("json")
        const { licenseId } = c.req.valid("param")
        
        const isUserExistInLicense = await prisma.license.findUnique({
          where: {
            users: {
              every: {
                id: data.userId
              }
            },
            id: licenseId
          }
        })
  
        if(!isUserExistInLicense) {
          return c.json({ error: "Usuário ja esta com a licença" }, 400)
        } 
  
        if(data.allocateType == "deallocate") {
          await prisma.license.update({
            where: {
              id: licenseId
            },
            data: {
              users: {
                disconnect: {
                  id: data.userId
                }
              }
            }
          })
          return c.json({ message: "Usuario dealocado com sucesso" }, 200)
        }
  
        await prisma.license.update({
          where: {
            id: licenseId
          }, 
          data: {
            users: {
              connect: {
                id: data.userId
              }
            }
          }
        })
  
        return c.json({ message: "Usuario alocado com sucesso" }, 200)
      } catch  {
        return c.json({ error: "Error ao alocar usuario" }, 400)
      }

    }
  )

export default app
