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

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || "Erro ao atualizar ticket")
      }

      return (await res.json()).message
    },

    onSuccess:(data) => {
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