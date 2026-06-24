
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { navigation } from '@/utils/constants/navigation'

function normalizePathname(pathname: string) {
  if (pathname === '/') return pathname
  return pathname.replace(/\/+$/, '')
}

export async function proxy(request: NextRequest) {
  const pathname = normalizePathname(request.nextUrl.pathname)

  const isLoginPage = pathname === '/login'

  const verifyUrl = new URL('/api/auth/verify', request.url)

  function getDefaultRedirect(role: string) {
    return role === 'user' ? '/tickets' : '/'
  }


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
        const role = data.user.role as string
        return NextResponse.redirect(new URL(getDefaultRedirect(role), request.url))
      }

      return NextResponse.next()
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const role = data.user.role as string
    const nextResponse = NextResponse.next()

    nextResponse.headers.set('x-user-role', role)
    nextResponse.headers.set('x-user-id', data.user.id)

    const authRoutes = navigation.reduce<Record<string, string[]>>((acc, item) => {
      acc[normalizePathname(item.href)] = item.roles
      return acc
    }, {})

    const routeRoles = authRoutes[pathname]

    if (routeRoles && !routeRoles.includes(role)) {
      return NextResponse.redirect(new URL(getDefaultRedirect(role), request.url))
    }

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