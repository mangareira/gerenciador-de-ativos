
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === '/login'

  const dashboardUrl = new URL('/', request.url)

  const verifyUrl = new URL('/api/auth/verify', request.url)

  try {
    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      if (isLoginPage) {
        return NextResponse.next()
      }

      return NextResponse.redirect(new URL('/login', request.url))
    }

    const data = await response.json()

    const isAuthenticated = data.authenticated

    if (isLoginPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(dashboardUrl)
      }

      return NextResponse.next()
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const nextResponse = NextResponse.next()

    nextResponse.headers.set('x-user-role', data.user.role)
    nextResponse.headers.set('x-user-id', data.user.id)

    const setCookie = response.headers.get('set-cookie')

    if (setCookie) {
      nextResponse.headers.append('set-cookie', setCookie)
    }

    return nextResponse
  } catch (error) {
    console.error('Erro na autenticação:', error)

    if (isLoginPage) {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}