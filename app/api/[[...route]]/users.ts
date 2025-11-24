import { prisma } from "@/lib/prisma";
import { CreateUserSchema } from "@/utils/schemas/user.schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const app = new Hono()
  .post(
    '/create',
    zValidator("json", 
      CreateUserSchema,
    ), 
    async (c) => {
      const values = c.req.valid("json");
      
      const user = await prisma.user.create({
        data: values,
      });

      if(!user) {
        return c.json({ error: "Usuario nao criado" }, 500);
      }

      return c.json({ user });
    }
  )

export default app

  