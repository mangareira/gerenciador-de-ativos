import { client } from "@/lib/hono";
import { ContractSchema } from "@/utils/schemas/contracts.schemas";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetContract = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["contract", id],
    queryFn: async () => {
      const res = await client.api.contract["get-by-id"][":id"].$get({
        param: {
          id,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erro ao buscar contrato");
        return;
      }

      const { contract } = await res.json();

      return ContractSchema.parse(contract);
    },
  });

  return query;
};

export default useGetContract;
