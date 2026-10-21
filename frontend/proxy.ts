import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { jwtUtils } from './lib/jwt'
import { cookies } from 'next/headers'
import { getNewRefreshToken } from './services/refrreshToken'

export async function proxy(request: NextRequest) {

    const AUTH_ROUTES = ['/auth/login', '/auth/register']
    const PUBLIC_ROUTES = ['/', '/about', '/contact']
    const pathname = request.nextUrl.pathname;

    const cookieStore = await cookies();

    let accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    let decodedAccssToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET!) : null;
    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET!) : null;

    if (!decodedAccssToken?.success && decodedRefreshToken?.success) {
        //access token has expired but refresh token is valid, get new access token from backend
        const result = await getNewRefreshToken();

        if (result.success) {
            const newAccessToken = result.data.accessToken;
            console.log("newAccessToken:::", newAccessToken)

            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 60 * 24,
                sameSite: "none",
            });

            accessToken = newAccessToken;
            decodedAccssToken = jwtUtils.verifyToken(newAccessToken, process.env.JWT_ACCESS_SECRET!)
        }
    }

    let userRole = null

    if (!decodedAccssToken?.success) {
        cookieStore.delete('accessToken');
        // return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (decodedAccssToken?.success && decodedAccssToken.data) {
        userRole = (decodedAccssToken.data as JwtPayload).role
    }


    if (accessToken && AUTH_ROUTES.includes(pathname)) {
        if (userRole === "USER") {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        } else if (userRole === "AUTHOR") {
            return NextResponse.redirect(new URL('/author-dashboard', request.url))
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL('/admin-dashboard', request.url))
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

    if (pathname.startsWith('/dashboard') && userRole !== "USER") {
        return NextResponse.redirect(new URL('/not-found', request.url))
    } else if (pathname.startsWith('/author-dashboard') && userRole !== "AUTHOR") {
        return NextResponse.redirect(new URL('/not-found', request.url))
    } else if (pathname.startsWith('/admin-dashboard') && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL('/not-found', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    ],
}