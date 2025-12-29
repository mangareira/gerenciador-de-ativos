import { prisma } from "@/lib/prisma";
import { UserRoleSchema } from "@/utils/schemas/enums.schemas";
import { CreateUserSchema } from "@/utils/schemas/user.schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

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
  .get(
    '/get-user-by-role/:role',
    zValidator(
      "param",
      z.object({
        role: UserRoleSchema
      })
    ),
    async (c) => {
      const { role } = c.req.valid('param')

      const users = await prisma.user.findMany({
        where: {
          role,
        }
      })

      if(!users) {
        return c.json({error: "Usuarios não encontrado!"}, 404)
      }

      return c.json( users )
    }
  )
  .get(
    '/get-all',
    async (c) => {

      const users = await prisma.user.findMany()

      if(!users) {
        return c.json({error: "Usuários não encontrado!"}, 404)
      }

      return c.json( users )

    }
  )

export default app

  