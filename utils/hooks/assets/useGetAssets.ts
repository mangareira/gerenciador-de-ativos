import { useQuery } from '@tanstack/react-query';
import { parseAssetDates } from '@/lib/utils';
import { client } from '@/lib/hono';

export const useGetAssets = () => {
  const query = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const response = await client.api.asset['get-assets'].$get();
      if (!response.ok) throw new Error('failed to fecth assets');
      const { assets } = await response.json() ;
      return assets.map(parseAssetDates);
    },
  }); 
  return query;
};
