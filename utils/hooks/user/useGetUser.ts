import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { UserSchema } from '@/utils/schemas/user.schemas';

export const useGetUser = ({ id }: { id: string }) => {
  const query = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await client.api.user['get-user-by-id'][':id'].$get({
        param: {
          id
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao encontrar o Usuario')
      }

      return UserSchema.parse((await response.json()))
    },
  });
  return query;
};
