import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  const userToken = request.cookies.get('user_token')
  const isLoginRoute = pathname.startsWith('/login')

  // disconsider next internal routes
  if (pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // any url in app except the /login route
  if (!isLoginRoute && !userToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
