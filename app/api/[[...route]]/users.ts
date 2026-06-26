import { prisma } from "@/lib/prisma";
import { UserRoleSchema } from "@/utils/schemas/enums.schemas";
import { CreateUserSchema, UpdateUserSchema } from "@/utils/schemas/user.schemas";
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
    authMiddleware,
    requireRoles('admin', 'technician', "manager", "user"),
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
    authMiddleware,
    requireRoles('admin', 'technician', "manager"),
    async (c) => {

      const users = await prisma.user.findMany({
        omit: {
          password: true
        },
        include: {
          department: true
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
  .put(
    '/update/:id',
    authMiddleware,
    requireRoles('admin'),
    zValidator(
      'param',
      z.object({
        id: z.cuid(),
      })
    ),
    zValidator('json', UpdateUserSchema),
    async (c) => {
      const { id } = c.req.valid('param')
      const values = c.req.valid('json')

      try {
        const user = await prisma.user.update({
          where: { id },
          data: {
            ...values,
            departmentId: values.departmentId ?? null,
          },
          omit: {
            password: true,
          },
        })

        return c.json({ user })
      } catch {
        return c.json({ error: 'Usuário não encontrado!' }, 404)
      }
    }
  )
  .delete(
    '/delete/:id',
    authMiddleware,
    requireRoles('admin'),
    zValidator(
      'param',
      z.object({
        id: z.cuid(),
      })
    ),
    async (c) => {
      const { id } = c.req.valid('param')

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          department: true,
        },
      })

      if (!user) {
        return c.json({ error: 'Usuário não encontrado!' }, 404)
      }

      if (user.departmentId) {
        const departmentManager = await prisma.user.findFirst({
          where: {
            departmentId: user.departmentId,
            id: { not: id },
          },
          orderBy: {
            createdAt: 'asc',
          },
        })

        if (departmentManager) {
          await prisma.department.update({
            where: { id: user.departmentId },
            data: {
              managerId: departmentManager.id,
            },
          })
        } else {
          await prisma.department.update({
            where: { id: user.departmentId },
            data: {
              managerId: user.id,
            },
          })
        }
      }

      await prisma.ticket.deleteMany({
        where: {
          OR: [
            { requesterId: id },
            { assignedToId: id },
          ],
        },
      })

      await prisma.user.updateMany({
        where: {
          departmentId: user.departmentId,
          id: { not: id },
        },
        data: {
          departmentId: null,
        },
      })

      await prisma.user.delete({
        where: { id },
      })

      return c.json({ success: true })
    }
  )

export default app

