import { prisma } from "@/lib/prisma";
import { UserRoleSchema } from "@/utils/schemas/enums.schemas";
import { CreateUserSchema } from "@/utils/schemas/user.schemas";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { hash } from "argon2";
import { authMiddleware } from "./middeware/middleware";
import { requireRoles } from "./middeware/roles";

const app = new Hono()
  .post(
    '/create',
    authMiddleware,
    requireRoles('admin'),
    zValidator("json",
      CreateUserSchema,
    ),
    async (c) => {
      const values = c.req.valid("json");

      const hashedPassword = await hash(values.password);

      const user = await prisma.user.create({
        data: {
          ...values,
          password: hashedPassword
        },
        omit: {
          password: true,
        }
      });

      if (!user) {
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
        },
        omit: {
          password: true
        }
      })

      if (!users) {
        return c.json({ error: "Usuarios não encontrado!" }, 404)
      }

      return c.json(users)
    }
  )
  .get(
    '/get-all',
    async (c) => {

      const users = await prisma.user.findMany({
        omit: {
          password: true
        }
      })

      if (!users) {
        return c.json({ error: "Usuários não encontrado!" }, 404)
      }

      return c.json(users)

    }
  )
  .get(
    '/get-user-by-id/:id',
    authMiddleware,
    requireRoles('admin', "manager", "user", "technician"),
    zValidator(
      "param",
      z.object({
        id: z.cuid(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid('param')

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        omit: {
          password: true
        }
      })

      if (!user) {
        return c.json({ error: "Usuario não encontrado!" }, 404)
      }

      return c.json(user)
    }
  )

export default app

