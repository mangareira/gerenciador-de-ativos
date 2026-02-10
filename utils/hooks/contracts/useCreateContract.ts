import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.contract.create.$post
>;
type RequestType = InferRequestType<
  typeof client.api.contract.create.$post
>["json"];

export const useCreateContract = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.contract.create.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Contrato criado com sucesso");
    },
    onError: () => {
      toast.error("Falha ao criar contrato");
    },
  });

  return mutation;
};
