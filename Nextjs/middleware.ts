import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // if (request.nextUrl.pathname = '/admin') {
    //     let link = process.env.REACT_APP_ADMIN_URL
    //     return NextResponse.redirect(new URL(`${link}`, request.url))
    // }


    // return response
    // return NextResponse.redirect(new URL('/', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/admin',
        // '/about/:path*',
        // '/dashboard/:path*'
    ],
}