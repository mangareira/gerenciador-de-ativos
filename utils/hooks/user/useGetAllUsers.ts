import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { UserSchema } from '@/utils/schemas/user.schemas';

export const useGetAllUsers = () => {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await client.api.user['get-all'].$get()

      if(!response.ok) {
        throw new Error('Erro ao encontrar os Usuarios')
      }

      return UserSchema.array().parse((await response.json()))
    },
  }); 
  return query;
};
