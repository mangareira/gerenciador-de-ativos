import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

export const useGetMaintenance = (assetId: string) => {
  const query = useQuery({
    enabled: !!assetId,
    queryKey: ['maintenance', { assetId }],
    queryFn: async () => {
      const response = await client.api.asset.maintenance[':assetId'].$get({
        param: { assetId },
      });
      if (!response.ok) throw new Error('failed to fetch maintenance');
      const { maintenance } = await response.json();
      
      return maintenance
    },
    select: (data) => data.map((item) => ({
      ...item,
      maintenanceDate: new Date(item.maintenanceDate),
      createdAt: new Date(item.createdAt),
      technician: item.technician ? {
        ...item.technician,
        createdAt: 
          item.technician?.createdAt 
            ? new Date(item.technician.createdAt) 
            : new Date(),
        updatedAt: 
          item.technician?.updatedAt
            ? new Date(item.technician.updatedAt)
            : new Date()
      } : null,
      nextMaintenance: 
        item?.nextMaintenance
          ? new Date(item.nextMaintenance)
          : null
    }))
  });
  return query;
};
