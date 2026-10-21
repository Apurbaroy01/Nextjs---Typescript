import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'

export function proxy(request: NextRequest) {

    const AUTH_ROUTES = ['/auth/login', '/auth/register']
    const PUBLIC_ROUTES = ['/', '/about', '/contact']

    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get('accessToken')?.value
    const decoded = accessToken ? jwt.decode(accessToken) as JwtPayload : null;
    


    if (accessToken && AUTH_ROUTES.includes(pathname)) {
        if (decoded?.role == "USER") {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        } else if (decoded?.role == "AUTHOR") {
            return NextResponse.redirect(new URL('/author', request.url))
        } else if (decoded?.role == "ADMIN") {
            return NextResponse.redirect(new URL('/admin', request.url))
        } else {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    const publicRoute = PUBLIC_ROUTES.some((route) => route === pathname || pathname.startsWith(route + '/'))
    const authRoute = AUTH_ROUTES.some((route) => route === pathname || pathname.startsWith(route + '/'))

    // when accessToken is not present and the route is not public and not auth route
    if (!accessToken && !authRoute && !publicRoute) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
}
 

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ],
}