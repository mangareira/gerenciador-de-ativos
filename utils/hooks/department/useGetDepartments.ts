import { useQuery } from '@tanstack/react-query';
import { parseAssetDates } from '@/lib/utils';
import { client } from '@/lib/hono';

export const useGetDepartments = () => {
  const query = useQuery({
    queryKey: ['department'],
    queryFn: async () => {
      const response = await client.api.departament['get-departments'].$get();
      if (!response.ok) throw new Error('failed to fecth assets');
      const { departments } = await response.json() ;
      return departments.map(parseAssetDates);
    },
  }); 
  return query;
};
