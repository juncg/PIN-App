import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'es'];

export function middleware(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    // Get locale from URL params, cookie, or use default
    let locale = searchParams.get('locale');
    
    if (!locale) {
        // Try to get locale from cookie
        locale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    }

    // Validate locale
    if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
        locale = DEFAULT_LOCALE;
    }

    // Create response
    const response = NextResponse.next();

    // Set locale in URL if not present
    if (!searchParams.get('locale')) {
        const url = request.nextUrl.clone();
        url.searchParams.set('locale', locale);
        const redirectResponse = NextResponse.redirect(url);
        
        // Set cookie
        redirectResponse.cookies.set(LOCALE_COOKIE_NAME, locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
        });
        
        return redirectResponse;
    }

    // Update cookie if locale changed
    if (locale !== request.cookies.get(LOCALE_COOKIE_NAME)?.value) {
        response.cookies.set(LOCALE_COOKIE_NAME, locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
        });
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|_static|favicon.ico).*)']
};
