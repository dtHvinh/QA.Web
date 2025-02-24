import { Routes } from "@/utilities/Constants";
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type Environment = "production" | "development" | "other";

export function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith('/auth')) {
        const cookie = request.cookies.get('auth');
        if (!cookie) {
            return NextResponse.redirect(new URL(Routes.Auth.Login, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
    ],
};