import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
const DEFAULT_LOCALE = 'en';
const SUPPORTED_LOCALES = ['en', 'es'];

function getLocaleFromAcceptLanguage(acceptLanguage: string | null): string {
    if (!acceptLanguage) return DEFAULT_LOCALE;
    
    // Parse Accept-Language header (e.g., "es-ES,es;q=0.9,en;q=0.8")
    const languages = acceptLanguage
        .split(',')
        .map(lang => {
            const [locale, q = 'q=1'] = lang.trim().split(';');
            const quality = parseFloat(q.split('=')[1] || '1');
            return { locale: locale.split('-')[0], quality };
        })
        .sort((a, b) => b.quality - a.quality);
    
    // Find first supported locale
    for (const { locale } of languages) {
        if (SUPPORTED_LOCALES.includes(locale)) {
            return locale;
        }
    }
    
    return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    // Get locale from: 1) URL param, 2) Cookie, 3) Browser language, 4) Default
    let locale = searchParams.get('locale');
    
    if (!locale) {
        // Try to get locale from cookie
        locale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    }
    
    if (!locale) {
        // Detect from browser's Accept-Language header
        const acceptLanguage = request.headers.get('accept-language');
        locale = getLocaleFromAcceptLanguage(acceptLanguage);
    }

    // Validate locale
    if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
        locale = DEFAULT_LOCALE;
    }

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
            httpOnly: false,
        });
        
        return redirectResponse;
    }

    // Create response
    const response = NextResponse.next();

    // Update cookie if locale changed
    if (locale !== request.cookies.get(LOCALE_COOKIE_NAME)?.value) {
        response.cookies.set(LOCALE_COOKIE_NAME, locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
            httpOnly: false,
        });
    }

    return response;
}

export const config = {
    matcher: ['/((?!api|_next|_static|favicon.ico).*)']
};
