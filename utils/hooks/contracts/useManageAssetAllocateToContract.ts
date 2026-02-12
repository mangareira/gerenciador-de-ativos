import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<
  typeof client.api.contract.allocate[':id']['$put']
>;
type RequestType = InferRequestType<
  typeof client.api.contract.allocate[':id']['$put']
>['json'];

export const useManageAssetAllocateToContract = (contractId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.contract.allocate[':id']['$put']({
        json,
        param: { id: contractId },
      });

      if (!res.ok) throw new Error('failed to allocate asset');

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', contractId] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast.success('Ativo alocado ao contrato com sucesso');
    },
    onError: () => {
      toast.error('Falha ao alocar ativo');
    },
  });

  return mutation;
};

export default useManageAssetAllocateToContract;
