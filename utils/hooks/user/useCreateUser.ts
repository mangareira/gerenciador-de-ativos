import { client } from "@/lib/hono";
import { CreateUser } from "@/utils/schemas/user.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUser) => {
      const res = await client.api.user.create.$post({
        json: data,
      });

      if (!res.ok) {
        const error = await res.json() as { error?: string; message?: string }
        toast.error(error.error || error.message || "Erro ao buscar tickets")
        return
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Usuário criado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar usuário");
    },
  });
};
