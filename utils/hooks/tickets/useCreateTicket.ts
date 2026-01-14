import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";


type ResponseType = InferResponseType<typeof client.api.ticket.create.$post>;
type RequestType = InferRequestType<typeof client.api.ticket.create.$post>['json'];

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.ticket.create.$post({ json });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Chamado criado com sucesso');
    },
    onError: () => {
      toast.error('Falha ao criar Chamado');
    },
  });
  return mutation;
}
