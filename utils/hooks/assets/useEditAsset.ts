import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.asset.edit[':id']['$patch']>;
type RequestType = InferRequestType<typeof client.api.asset.edit[':id']['$patch']>['json'];

export const useEditAsset = (id: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.asset.edit[':id']['$patch']({
        json,
        param: { id },
      });

      if (!res.ok) throw new Error('failed to fetch asset');

      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['asset'] });
      toast.success('Ativo autalizada');
    },
    onError: () => {
      toast.error('Falha ao autalizar o Ativo');
    },
  });
  return mutation;
};
