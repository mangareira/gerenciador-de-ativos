import { UserPayload } from '@/types/auth'
import { UserRole } from '@/utils/schemas/enums.schemas'
import type { Context, Next } from 'hono'

export function requireRoles(...roles: UserRole[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as UserPayload | undefined

    if (!user) {
      return c.json({ message: 'Usuário não autenticado' }, 401)
    }

    const hasRole = roles.includes(user.sub.role)

    if (!hasRole) {
      return c.json({ message: 'Acesso negado: role insuficiente' }, 403)
    }

    await next()
  }
}