import { Hono } from "hono";
import { CreateAssetSchema } from "@/utils/schemas/schemas";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/lib/prisma";

const app = new Hono()
  .get('/get-assets', async (c) => {
    try {
      const assets = await prisma.asset.findMany({
        include: {
          department: true,
          assignedTo: true,
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
        return c.json({ error: "Ativo nao criado" }, 500);
      }

      return c.json({ asset });
    }
   )

export default app