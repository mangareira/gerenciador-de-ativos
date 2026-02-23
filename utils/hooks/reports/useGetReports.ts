import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/hono';
import { ReportSchema } from '@/utils/schemas/report.schemas';
import { toast } from 'sonner';

export const useGetReports = () => {
  const query = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await client.api.report['get-reports'].$get();
      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Erro ao buscar tickets")
        return
      }
      const data = await response.json();
      return ReportSchema.parse(data);
    },
  });

  return query;
};

export default useGetReports;
