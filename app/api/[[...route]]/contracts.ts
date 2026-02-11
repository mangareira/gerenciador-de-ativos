import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { CreateContractSchema, UpdateContractSchema } from "@/utils/schemas/contracts.schemas";

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
  ).
  put(
  "/update/:id",
  zValidator(
    "param",
    z.object({
      id: z.cuid(),
    })
  ),
  zValidator("json", UpdateContractSchema),
  async (c) => {
    try {
      const { id: id } = c.req.valid("param");

      const values = c.req.valid("json");

      await prisma.contract.update({
        where: { id },
        data: {
          ...values,
          updatedAt: new Date(),
        },
      });

      return c.json({ message: "Contrato atualizado com sucesso" }, 200);
    } catch (error) {
      console.error("Erro ao atualizar contrato:", error);
      return c.json({ error: "Erro ao atualizar contrato" }, 400);
    }
  }
);

export default app;
