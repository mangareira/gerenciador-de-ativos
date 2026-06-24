import type { Context, Next } from 'hono'
import { getCookie, getSignedCookie, setCookie, setSignedCookie } from 'hono/cookie'
import { verifyJwtToken } from '@/lib/jwt'
import { loginService } from '../services/login'

const isProd = process.env.NODE_ENV === 'production'
const cookieSecret = process.env.SECRET_KEY!

function setAuthCookies(
  c: Context,
  accessToken: string,
  refreshToken: string,
) {
  setCookie(c, 'access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    maxAge: 60 * 60,
    path: '/',
  })

  // cookie assinado, igual sua ideia de signedCookies
  return setSignedCookie(c, 'refresh_token', refreshToken, cookieSecret, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}

export async function authMiddleware(c: Context, next: Next) {
  try {
    let token = getCookie(c, 'access_token')

    if (!token) {
      const authHeader = c.req.header('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
      }
    }

    if (!token) {
      const refreshToken = await getSignedCookie(c, cookieSecret, 'refresh_token')

      if (!refreshToken) {
        return c.json({ message: 'Nenhum token de acesso ou refresh fornecido' }, 401)
      }

      const newTokens = await loginService.refreshToken(refreshToken)

      await setAuthCookies(c, newTokens.access_token, newTokens.refresh_token)

      const payload = await verifyJwtToken(newTokens.access_token)
      c.set('user', payload)
      await next()
      return
    }

    try {
      const payload = await verifyJwtToken(token)
      c.set('user', payload)
      await next()
      return
    } catch (error: any) {
      // Se o access token expirou, tenta refresh
      const refreshToken = await getSignedCookie(c, cookieSecret, 'refresh_token')

      if (!refreshToken) {
        return c.json({ message: 'Access token expirado e nenhum refresh token fornecido' }, 401)
      }

      const newTokens = await loginService.refreshToken(refreshToken)

      await setAuthCookies(c, newTokens.access_token, newTokens.refresh_token)

      const payload = await verifyJwtToken(newTokens.access_token)
      c.set('user', payload)
      await next()
    }
  } catch {
    return c.json({ message: 'Falha na autenticação' }, 401)
  }
}