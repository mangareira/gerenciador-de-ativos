import { Hono } from "hono";
import { CreateDepartmentSchema } from "@/utils/schemas/schemas";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "@/lib/prisma";

const app = new Hono()
  .post(
    '/create', 
    zValidator("json", 
      CreateDepartmentSchema,
    ), 
    async (c) => {
      const values = c.req.valid("json");
      
      const department = await prisma.department.create({
        data: values,
      });

      if(!department) {
        return c.json({ error: "Departamento nao criado" }, 500);
      }

      return c.json({ department });
    }
  )
  .get(
    '/get-departments', 
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
