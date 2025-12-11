import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.asset['movement-history']['$post']>;
type RequestType = InferRequestType<typeof client.api.asset['movement-history']['$post']>['json'];

export const useCreateMovementHistory = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.asset['movement-history'].$post({ json })
      return await res.json();
    },
    onSuccess: (_, movement) => {
      queryClient.invalidateQueries({ queryKey: ['asset', {id: movement.assetId} ] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', {id: movement.assetId} ] });
    },
  });
  return mutation;
};
