import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
    const userLanguage = request.headers.get("accept-language") || '';

    const preferredLanguage = userLanguage.startsWith('es') ? 'es' : 'en';
  
    const { nextUrl } = request;

    const newPath = `/${preferredLanguage}${nextUrl.pathname}`;
    const newURL = `${nextUrl.origin}${newPath}`
    return NextResponse.redirect(newURL);
}
 
export const config = {
    matcher: '/((?!es|en|public|api|_next/static|_next/image|favicon.ico).*)',
};