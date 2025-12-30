import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { CreateAssetSchema, UpdateAssetSchema } from "@/utils/schemas/assets.schemas";
import { CreateAssetMovementSchema } from "@/utils/schemas/assetsMovementHistory.schemas";
import { createMaintenanceSchema } from "@/utils/schemas/maintenance.schemas";

const app = new Hono()
  .get('/get-assets', async (c) => {
    try {
      const assets = await prisma.asset.findMany({
        include: {
          department: true,
          assignedTo: true,
          movements: true
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return c.json({ assets });
    } catch {
      return c.json({ error: "Erro ao buscar ativos" }, 500);
    }
  })
  .get(
    '/get-assets/:id',
    zValidator("param", 
      z.object({
        id: z.string(),
      }),
    ) ,
    async (c) => {
      const id = c.req.param("id");

      const asset = await prisma.asset.findUnique({
        where: {
          id,
        },
        include: {
          department: true,
          assignedTo: true,
          movements: {
            orderBy: {
              movementDate: "desc"
            }
          }
        },
      });

      if(!asset) {
        return c.json({ error: "Ativo nao encontrado" }, 404);
      }

      return c.json({ asset: {
        ...asset,
        specifications: asset.specifications || {},
      } });
    }
  )
  .post('/create',
    zValidator("json", 
      CreateAssetSchema,
    ) , 
    async (c) => {
      const values = c.req.valid("json");

      const asset = await prisma.asset.create({
        data: values,
      });

      if(!asset) {
        return c.json({ error: "Ativo nao criado" }, 400);
      }

      return c.json({ asset }, 201);
    }
   )
  .get(
    '/movement-history/:assetId',
    zValidator(
      "param",
      z.object({
        assetId: z.string()
      })
    ),
    async (c) => {

      const { assetId } = c.req.valid("param")

      const movement = await prisma.assetMovement.findMany({
        where: {
          assetId,
        },
        include: {
          fromUser: true,
          technician: true,
          toUser: true
        }
      })

      if(!movement) return c.json({ error: "Historico nao encontrado" }, 404);

      return c.json({ movement })
    }
   )
  .post(
    '/movement-history',
    zValidator(
      "json",
      CreateAssetMovementSchema,
    ),
    async (c) => {
      const values = c.req.valid("json")

      const movement = await prisma.assetMovement.create({
        data: values
      })

      if(!movement) return c.json({ error: "Movimento não criado" }, 400)

      return c.json({ movement }, 201)
    }
  )
  .patch(
    '/edit/:id',
    zValidator(
      'json',
      UpdateAssetSchema
    ),
    zValidator(
      'param',
      z.object({
        id: z.cuid()
      })
    ),
    async (c) => {
      const values = c.req.valid('json')
      const { id } = c.req.valid('param')

      if(!id) {
        return c.json({error: "Id é obrigatorio"}, 404)
      } 

      const update = await prisma.asset.update({
        where: {
          id
        },
        data: values,
        include: {
          assignedTo: true,
          department: true,
          movements: true
        }
      })

      if(!update) {
        return c.json({error: "Erro ao atualizar Ativo"}, 400)
      }

      return c.json({ update })
    }
  )
  .post(
    '/maintenance',
    zValidator(
      'json',
      createMaintenanceSchema,
    ),
    async (c) => {
      const values = c.req.valid('json')

      const [maintenance] = await prisma.$transaction([
        prisma.maintenance.create({
          data: values
        }),
        prisma.asset.update({
          where: {
            id: values.assetId
          },
          data: {
            status: 'maintenance',
            lastMaintenanceDate: values.maintenanceDate
          }
        })
      ])

      if(!maintenance) { 
        return c.json({ error: "Erro ao criar a manutenção" }, 400)
      }

      return c.json({ maintenance })
    }
  )
  .get(
    '/maintenance/:assetId',
    zValidator(
      'param',
      z.object({
        assetId: z.cuid()
      })
    ),
    async (c) => {
      const { assetId } = c.req.valid('param')
   
      const maintenance = await prisma.maintenance.findMany({
        where: {
          assetId,
        },
        include: {
          technician: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if(!maintenance) {
        return c.json({ error: "Erro ao encontrar as manuteções" }, 404)
      }

      return c.json({ maintenance })
    }
  )

export default app