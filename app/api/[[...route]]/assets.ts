import { Hono } from "hono";
import { CreateAssetSchema } from "@/utils/schemas/schemas";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/lib/prisma";

const app = new Hono()
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