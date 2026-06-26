import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.user.delete[":id"].$delete({
        param: { id },
      });

      if (!res.ok) {
        const error = await res.json() as { error?: string; message?: string };
        throw new Error(error.error || error.message || "Erro ao excluir usuário");
      }
    },
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir usuário");
    },
  });
};
