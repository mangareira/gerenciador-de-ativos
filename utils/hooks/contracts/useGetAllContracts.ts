import { client } from "@/lib/hono";
import { ContractSchema } from "@/utils/schemas/contracts.schemas";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllContracts = () => {
  const query = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const res = await client.api.contract["get-all"].$get();

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erro ao buscar contratos");
        return;
      }

      const { contracts } = await res.json();

      return ContractSchema.array().parse(contracts);
    },
  });

  return query;
};
