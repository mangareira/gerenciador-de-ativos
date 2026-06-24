import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { setCookie, setSignedCookie } from 'hono/cookie'
import type { UserPayload } from '@/types/auth'
import { loginSchema } from '@/utils/schemas/login.schemas'
import { loginService } from './services/login'
import { authMiddleware } from './middeware/middleware'


const cookieSecret = process.env.SECRET_KEY!
const isProd = process.env.NODE_ENV === 'production'

async function makeCookie(
  c: any,
  result: { access_token: string; refresh_token: string },
) {
  setCookie(c, 'access_token', result.access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    maxAge: 60 * 60,
    path: '/',
  })

  await setSignedCookie(c, 'refresh_token', result.refresh_token, cookieSecret, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}

const app = new Hono()
  .post(
    '/login',
    zValidator('json', loginSchema),
    async (c) => {
      try {
        const loginDto = c.req.valid('json')
        const result = await loginService.login(loginDto)

        await makeCookie(c, result)

        return c.json(
          {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
          },
          200,
        )
      } catch (error: any) {
        return c.json({ message: error.message ?? 'Erro ao fazer login' }, 400)
      }
    }
  )
  .get(
    '/verify',
    authMiddleware,
    async (c) => {
      const user = c.get('user' as never) as UserPayload | undefined

      return c.json({
        authenticated: true,
        user: {
          id: user?.sub.user_id,
          role: user?.sub.role,
        },
      })
    }
  )

export default app