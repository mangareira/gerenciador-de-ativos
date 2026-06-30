import { client } from "@/lib/hono"
import { AllocateUserLicense } from "@/utils/schemas/license.schemas"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useAllocateUserLicense = (licenseId: string) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: AllocateUserLicense) => {
      const res = await client.api.license.allocate[":licenseId"].$put({
        param: {
          licenseId,
        },
        json: data
      })

      const payload = await res.json() as { error?: string; message?: string }

      if (!res.ok) {
        throw new Error(payload.error || "Erro ao atualizar ticket")
      }

      return payload.message ?? ""
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] })
      queryClient.invalidateQueries({ queryKey: ["license", licenseId] })

      toast.success(data)
    },
    onError: () => {
      toast.error("Error ao alocar usuario")
    }
  })

  return mutation
}