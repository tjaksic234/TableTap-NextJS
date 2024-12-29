import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({req: request});

  const publicRoutes = ['/signin', '/signup']

  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
  ]
}