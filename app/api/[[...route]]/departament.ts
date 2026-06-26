import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/lib/prisma";
import { CreateDepartmentSchema } from "@/utils/schemas/department.schemas";
import { authMiddleware } from "./middeware/middleware";
import { requireRoles } from "./middeware/roles";

const app = new Hono()
  .post(
    '/create',
    authMiddleware,
    requireRoles('admin'),
    zValidator("json",
      CreateDepartmentSchema,
    ),
    async (c) => {
      const values = c.req.valid("json");

      const department = await prisma.department.create({
        data: values,
      });

      if (!department) {
        return c.json({ error: "Departamento nao criado" }, 500);
      }

      try {
        await prisma.user.update({
          where: { id: values.managerId },
          data: {
            departmentId: department.id,
          },
        });
      } catch {
        return c.json({ error: "Gerente não encontrado" }, 404);
      }

      return c.json({ department });
    }
  )
  .get(
    '/get-departments',
    authMiddleware,
    requireRoles('admin', 'manager', 'technician', 'user'),
    async (c) => {
      try {
        const departments = await prisma.department.findMany({
          orderBy: {
            name: 'asc',
          },
        });

        return c.json({ departments });
      } catch {
        return c.json({ error: "Erro ao buscar departamentos" }, 500);
      }
    }
  )

export default app
