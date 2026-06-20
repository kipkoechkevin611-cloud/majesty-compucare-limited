import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public routes — always allowed
        if (
          pathname === '/' ||
          pathname.startsWith('/products') ||
          pathname.startsWith('/shop') ||
          pathname === '/about' ||
          pathname === '/contact' ||
          pathname === '/services' ||
          pathname === '/login' ||
          pathname === '/register' ||
          pathname === '/forgot-password'
        ) {
          return true
        }

        // Admin routes — require authentication and ADMIN role
        if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
          return !!token && token.role === 'ADMIN'
        }

        // Dashboard requires authentication
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }

        // Checkout and cart require authentication
        if (pathname.startsWith('/checkout') || pathname === '/cart') {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
    '/checkout/:path*',
    '/cart',
  ],
}
