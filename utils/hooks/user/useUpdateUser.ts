import { client } from "@/lib/hono";
import { UpdateUser } from "@/utils/schemas/user.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUser) => {
      const res = await client.api.user.update[":id"].$put({
        param: { id },
        json: data,
      });

      if (!res.ok) {
        const error = await res.json() as { error?: string; message?: string };
        throw new Error(error.error || error.message || "Erro ao atualizar usuário");
      }
    },
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar usuário");
    },
  });
};
