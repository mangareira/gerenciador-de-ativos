import { Hono } from "hono";
import { prisma } from "@/lib/prisma";

const app = new Hono()
  .get(
    '/get-reports', 
    async (c) => {
    try {
      const [assets, licenses, departments, tickets, contracts] = await prisma.$transaction([
        prisma.asset.findMany({
          include: {
            department: true,
            assignedTo: true,
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.license.findMany({
          include: { department: true, users: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.department.findMany({
          include: { manager: true },
          orderBy: { name: 'asc' },
        }),
        prisma.ticket.findMany({
          include: { requester: true, assignedTo: true, asset: true },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.contract.findMany({
          include: { contractAssets: true },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

      return c.json({ assets, licenses, departments, tickets, contracts }, 200);
    } catch {
      return c.json({ error: 'Erro ao buscar reports' }, 500);
    }
  });

export default app;
