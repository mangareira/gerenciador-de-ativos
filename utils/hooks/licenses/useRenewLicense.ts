import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.license.update[":id"]["$put"]
>;
type RequestType = InferRequestType<
  typeof client.api.license.update[":id"]["$put"]
>["json"];

export const useRenewLicense = (licenseId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.license.update[":id"].$put({
        param: { id: licenseId },
        json,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao atualizar licença");
      }

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      queryClient.invalidateQueries({ queryKey: ["license", licenseId] });
      toast.success("Licença renovada com sucesso");
    },
    onError: () => {
      toast.error("Falha ao renovar licença");
    },
  });

  return mutation;
};
