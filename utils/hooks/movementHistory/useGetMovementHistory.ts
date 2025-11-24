import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

export const useGetMovementHistory = (assetId: string) => {
  const query = useQuery({
    enabled: !!assetId,
    queryKey: ['movement-history', { assetId }],
    queryFn: async () => {
      const response = await client.api.asset['movement-history'][':assetId'].$get({
        param: { assetId },
      });
      if (!response.ok) throw new Error('failed to fetch asset');
      const { movement } = await response.json();
    
      return movement
    },
  });
  return query;
};
