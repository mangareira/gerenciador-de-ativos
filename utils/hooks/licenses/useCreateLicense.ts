import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.license.create.$post>;
type RequestType = InferRequestType<typeof client.api.license.create.$post>["json"];

export const useCreateLicense = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.license.create.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
      toast.success("Licença criada com sucesso");
    },
    onError: () => {
      toast.error("Falha ao criar licença");
    },
  });
  return mutation;
};
