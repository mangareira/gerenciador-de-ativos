import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { prisma } from "@/lib/prisma";
import { AllocateUserLicenseSchema, CreateLicenseSchema, LicenseSchema, UpdateLicenseSchema } from "@/utils/schemas/license.schemas";

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
        
        const license = await prisma.license.findUnique({
          where: {
            id: licenseId
          },
          include: {
            users: {
              select: {
                id: true
              }
            }
          }
        })

        if (!license) {
          return c.json({ error: "Licença não encontrada" }, 404)
        }

        const isUserAlreadyAllocated = license.users.some(user => user.id === data.userId)
        
        if (data.allocateType === "allocate") {
          if (isUserAlreadyAllocated) {
            return c.json({ error: "Usuário já está com esta licença" }, 400)
          }

          if (license.totalSeats !== null && license.totalSeats > 0) {
            const allocatedUsersCount = await prisma.user.count({
              where: {
                licenses: {
                  some: {
                    id: licenseId
                  }
                }
              }
            })

            if (allocatedUsersCount >= license.totalSeats) {
              return c.json({ error: "Não há vagas disponíveis nesta licença" }, 400)
            }
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

          return c.json({ message: "Usuário alocado com sucesso" }, 200)
        } 
        
        // Deallocate
        else if (data.allocateType === "deallocate") {
          if (!isUserAlreadyAllocated) {
            return c.json({ error: "Usuário não está com esta licença" }, 400)
          }

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
          return c.json({ message: "Usuário desalocado com sucesso" }, 200)
        }

        return c.json({ error: "Tipo de operação inválida" }, 400)

      } catch (error) {
        console.error("Erro ao alocar/desalocar usuário:", error)
        return c.json({ error: "Erro ao processar a solicitação" }, 400)
      }
    }
  )
  .put(
    "/update/:id",
    zValidator(
      "param",
      LicenseSchema.pick({
        id: true
      })
    ),
    zValidator(
      "json",
      UpdateLicenseSchema
    ),
    async (c) => {
      try {
        const values = c.req.valid("json")
        const { id } = c.req.valid("param")
  
        await prisma.license.update({
          where: {
            id,
          },
          data: values
        })
  
        return c.json({ message: "Licença atualizada com sucesso" }, 200)  
      } catch (error) {
        console.error(error);
        return c.json({error: "Erro ao atualizar a licença"}, 400)
      }
    }
  )

export default app
