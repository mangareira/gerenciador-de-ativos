import { client } from "@/lib/hono";
import { UpdateContract } from "@/utils/schemas/contracts.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateContract = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateContract) => {
      const res = await client.api.contract.update[":id"].$put({
        param: { id },
        json: data,
      });

      if (!res.ok) {
        const error = await res.json() as { error?: string; message?: string };
        throw new Error(error.error || error.message || "Erro ao atualizar contrato");
      }
    },
    onSuccess: () => {
      toast.success("Contrato atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contract", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar contrato");
    },
  });

  return mutation;
};
