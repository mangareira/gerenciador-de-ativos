import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { prisma } from "@/lib/prisma";
import { CreateContractSchema } from "@/utils/schemas/contracts.schemas";

const app = new Hono()
  .post(
    "/create",
    zValidator(
      "json", 
      CreateContractSchema
    ),
    async (c) => {
      const values = c.req.valid("json");

      try {
        const contract = await prisma.contract.create({
          data: values
        });

        if (!contract) {
          return c.json({ error: "Erro ao criar contrato" }, 400);
        }

        return c.json({ contract }, 201);
      } catch (error) {
        console.error("Erro ao criar contrato:", error);
        return c.json({ error: "Erro ao criar contrato" }, 400);
      }
    }
  )
  .get(
    "/get-all",
    async (c) => {
      try {
        const contracts = await prisma.contract.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            contractAssets: true,
          },
        });

        return c.json({ contracts }, 200);
      } catch (error) {
        console.error("Erro ao buscar contratos:", error);
        return c.json({ error: "Erro ao buscar contratos" }, 404);
      }
    }
  );

export default app;
