import { client } from "@/lib/hono"
import { Login } from "@/utils/schemas/login.schemas"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type LoginResponse = {
  access_token: string
  refresh_token: string
}

export const useLogin = () => {
  const mutation = useMutation<LoginResponse, Error, Login>({
    mutationFn: async (json) => {
      const response = await client.api.auth.login.$post({ json })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null)
        throw new Error(errorBody?.message ?? "Erro ao fazer login")
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success("Login realizado com sucesso")
    },
    onError: (error) => {
      toast.error(error.message === "Erro ao fazer login" ? error.message : "Senha ou email incorretos")
    },
  })

  return mutation
}