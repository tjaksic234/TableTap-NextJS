import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  const path = request.nextUrl.pathname
  
  const publicRoutes = ['/signin', '/signup']
  
  const isPublicRoute = publicRoutes.some((route) => 
    path.startsWith(route)
  )

  if (path === '/') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (!isPublicRoute && !token) {
    const from = request.nextUrl.pathname
    const url = new URL('/signin', request.url)
    url.searchParams.set('from', from)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', '/signin', '/signup'
  ]
}