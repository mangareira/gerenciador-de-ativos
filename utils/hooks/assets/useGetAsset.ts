import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';

export const useGetAsset = (id: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ['asset', { id }],
    queryFn: async () => {
      const response = await client.api.asset['get-assets'][':id'].$get({
        param: { id },
      });
      if (!response.ok) throw new Error('failed to fetch asset');
      const { asset } = await response.json();
      
      return {
        ...asset,
        purchaseDate: new Date(asset.purchaseDate),
        warrantyExpiry: new Date(asset.warrantyExpiry),
        specifications: (typeof asset.specifications === 'object' && asset.specifications !== null)
          ? (asset.specifications as Record<string, unknown>)
          : {},
        createdAt: new Date(asset.createdAt),
        updatedAt: new Date(asset.updatedAt),
        lastMaintenanceDate: asset.lastMaintenanceDate ? new Date(asset.lastMaintenanceDate) : null,
        assignedTo: asset.assignedTo
          ? {
              ...asset.assignedTo,
              createdAt: new Date(asset.assignedTo.createdAt),
              updatedAt: new Date(asset.assignedTo.updatedAt),
            }
          : null,
        movements: asset.movements.map((item) => (
          {
            ...item,
            movementDate: new Date(item.movementDate)
          }
        ))
      };
    },
  });
  return query;
};
