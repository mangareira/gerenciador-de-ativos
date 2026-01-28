import { client } from "@/lib/hono";
import { LicenseSchema } from "@/utils/schemas/license.schemas";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllLicenses = () => {
  const query = useQuery({
    queryKey: ["licenses"],
    queryFn: async () => {
      const res = await client.api.license["get-all"].$get();

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erro ao buscar licenças");
        return;
      }

      const { licenses } = await res.json();

      return LicenseSchema.array().parse(licenses);
    },
  });

  return query;
};
