import { client } from "@/lib/hono"
import { Login } from "@/utils/schemas/login.schemas"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useLogin = () => {
  const mutation = useMutation<void, Error, Login>({
    mutationFn: async (json) => {
      await client.api.auth.login.$post({
        json
      })
    },
    onSuccess: () => {
      toast.success("Login realizado com sucesso")
    },
    onError: (error) => {
      toast.error("Senha ou email incorretos")
    }
  })

  return mutation
}