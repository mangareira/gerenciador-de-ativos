import { verify } from 'argon2'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import { Login } from '@/utils/schemas/login.schemas'

export const loginService = {
  async login(login: Login) {
    const user = await prisma.user.findFirst({
      where: { email: login.email },
    })

    if (!user) {
      throw new Error('O Usuário não existe')
    }

    const verifyHash = await verify(user.password, login.password)


    if (!verifyHash) {
      throw new Error('Usuário ou a senha está incorreta')
    }

    const payload = {
      user_id: user.id,
      role: user.role,
    } as const

    const access_token = await signAccessToken(payload)
    const refresh_token = await signRefreshToken(payload)

    return { access_token, refresh_token }
  },

  async refreshToken(refreshToken: string) {
    try {
      // aqui você pode validar o token e também consultar o usuário no banco,
      // igual faz no Nest
      const decoded = await import('@/lib/jwt').then(m => m.verifyJwtToken(refreshToken))

      const user = await prisma.user.findUnique({
        where: { id: decoded.sub.user_id },
      })

      if (!user) {
        throw new Error('Usuário não existe')
      }

      const payload = {
        user_id: user.id,
        role: user.role,
      } as const

      const access_token = await signAccessToken(payload)
      const refresh_token = await signRefreshToken(payload)

      return { access_token, refresh_token }
    } catch {
      throw new Error('Token inválido ou expirado')
    }
  },
}