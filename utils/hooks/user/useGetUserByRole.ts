import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { UserRole } from '@/utils/schemas/enums.schemas';

export const useGetUserByRole = (role: UserRole) => {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await client.api.user['get-user-by-role'][':role'].$get({
        param: {
          role,
        }
      });

      if(!response.ok) {
        throw new Error('Erro ao encontrar os Usuarios')
      }

      return await response.json()
    },
  }); 
  return query;
};
