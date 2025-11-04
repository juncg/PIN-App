import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, PROTECTED_ROUTES, SUPPORTED_LOCALES } from "./lib/constants";
import { updateSession } from "./lib/supabase/middleware";

function getLocaleFromAcceptLanguage(acceptLanguage: string | null): string {
	if (!acceptLanguage) return DEFAULT_LOCALE;

	const languages = acceptLanguage
		.split(",")
		.map((lang) => {
			const [locale, q = "q=1"] = lang.trim().split(";");
			const quality = parseFloat(q.split("=")[1] || "1");
			return { locale: locale.split("-")[0], quality };
		})
		.sort((a, b) => b.quality - a.quality);

	for (const { locale } of languages) {
		if (SUPPORTED_LOCALES.includes(locale)) {
			return locale;
		}
	}

	return DEFAULT_LOCALE;
}

export async function proxy(request: NextRequest) {
	const { searchParams, pathname } = request.nextUrl;

	let locale = searchParams.get("locale");

	if (!locale) {
		const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME);
		locale = cookieLocale?.value ?? null;
	}

	if (!locale) {
		const acceptLanguage = request.headers.get("accept-language");
		locale = getLocaleFromAcceptLanguage(acceptLanguage);
	}

	if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
		locale = DEFAULT_LOCALE;
	}

	if (!searchParams.get("locale")) {
		const url = request.nextUrl.clone();
		url.searchParams.set("locale", locale);
		const redirectResponse = NextResponse.redirect(url);

		redirectResponse.cookies.set(LOCALE_COOKIE_NAME, locale, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
			sameSite: "lax",
			httpOnly: false,
		});

		return redirectResponse;
	}

	const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

	if (isProtected) {
		const sessionResponse = await updateSession(request);

		if (sessionResponse instanceof NextResponse && sessionResponse.status === 307) {
			return sessionResponse;
		}

		const response = sessionResponse;
		const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value ?? null;

		if (locale !== cookieLocale) {
			response.cookies.set(LOCALE_COOKIE_NAME, locale, {
				path: "/",
				maxAge: 60 * 60 * 24 * 365,
				sameSite: "lax",
				httpOnly: false,
			});
		}

		return response;
	}

	const response = NextResponse.next();
	const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value ?? null;

	if (locale !== cookieLocale) {
		response.cookies.set(LOCALE_COOKIE_NAME, locale, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365,
			sameSite: "lax",
			httpOnly: false,
		});
	}

	return response;
}

export const config = {
	matcher: ["/((?!api|_next|_static|favicon.ico).*)"],
};
