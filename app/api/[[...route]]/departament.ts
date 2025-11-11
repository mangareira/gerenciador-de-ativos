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

export default app
