import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl

  // Check if user is on auth pages
  const isAuthPage = pathname.startsWith('/auth')
  
  // Get token from cookies (more secure than localStorage in middleware)
  const token = request.cookies.get('auth-token')?.value

  // Public paths that don't require authentication
  const publicPaths = ['/auth/login', '/auth/register']
  const isPublicPath = publicPaths.includes(pathname)

  // If user is trying to access protected route without token, redirect to login
  if (!token && !isPublicPath && pathname !== '/') {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user has token and is trying to access auth pages, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}