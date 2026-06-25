import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

import { prisma } from "@/lib/prisma";
import { AllocateAssetToContractSchema, CreateContractSchema, UpdateContractSchema } from "@/utils/schemas/contracts.schemas";
import { authMiddleware } from "./middeware/middleware";
import { requireRoles } from "./middeware/roles";

const app = new Hono()
  .post(
    "/create",
    authMiddleware,
    requireRoles('admin', 'technician'),
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
    authMiddleware,
    requireRoles('admin', 'manager', 'technician'),
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
  )
  .get(
    "/get-by-id/:id",
    authMiddleware,
    requireRoles('admin', 'manager', 'technician'),
    zValidator(
      "param",
      z.object({ id: z.cuid() })
    ),
    async (c) => {
      try {
        const { id } = c.req.valid("param");

        const contract = await prisma.contract.findUnique({
          where: { id },
          include: { contractAssets: true },
        });

        if (!contract) {
          return c.json({ error: "Contrato não existe" }, 404);
        }

        return c.json({ contract }, 200);
      } catch (error) {
        console.error("Erro ao buscar contrato:", error);
        return c.json({ error: "Contrato não existe" }, 404);
      }
    }
  )
  .put(
    "/update/:id",
    authMiddleware,
    requireRoles('admin', 'technician'),
    zValidator(
      "param",
      z.object({
        id: z.cuid(),
      })
    ),
    zValidator(
      "json",
      UpdateContractSchema
    ),
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
  )
  .put(
    "/allocate/:id",
    authMiddleware,
    requireRoles('admin', 'technician'),
    zValidator(
      "param",
      z.object({
        id: z.cuid()
      })
    ),
    zValidator(
      "json",
      AllocateAssetToContractSchema
    ),
    async (c) => {
      try {
        const { id } = c.req.valid("param");
        const { assetId, allocateType } = c.req.valid("json");

        const contract = await prisma.contract.findUnique({
          where: { id },
          include: { contractAssets: { select: { id: true } } },
        });

        if (!contract) {
          return c.json({ error: "Contrato não existe" }, 404);
        }

        const isAllocated = contract.contractAssets.some((a) => a.id === assetId);

        if (allocateType === "allocate") {
          if (isAllocated) {
            return c.json({ error: "Ativo já vinculado" }, 400);
          }

          await prisma.contract.update({
            where: { id },
            data: {
              contractAssets: {
                connect: { id: assetId },
              },
              updatedAt: new Date(),
            },
          });

          return c.json({ message: "Allocação com sucesso" }, 200);
        }

        // deallocate
        if (allocateType === "deallocate") {
          if (!isAllocated) {
            return c.json({ error: "Ativo não está vinculado a este contrato" }, 400);
          }

          await prisma.contract.update({
            where: { id },
            data: {
              contractAssets: {
                disconnect: { id: assetId },
              },
              updatedAt: new Date(),
            },
          });

          return c.json({ message: "Dealocação com sucesso" }, 200);
        }

        return c.json({ error: "Tipo de operação inválida" }, 400);
      } catch (error) {
        console.error("Erro ao processar alocação/desalocação de ativo:", error);
        return c.json({ error: "Erro ao processar a solicitação" }, 400);
      }
    }
  )

export default app;
