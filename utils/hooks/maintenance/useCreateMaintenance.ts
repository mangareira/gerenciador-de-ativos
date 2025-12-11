import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<typeof client.api.asset.maintenance.$post>;
type RequestType = InferRequestType<typeof client.api.asset.maintenance.$post>['json'];

export const useCreateMaintenance = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.asset.maintenance.$post({ json })
      return await res.json();
    },
  });
  return mutation;
};
