import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const { searchParams } = request.nextUrl;

	const locale = searchParams.get('locale');

	if (!locale) {
		const url = request.nextUrl.clone();
		url.searchParams.set('locale', 'en');
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next|_static|favicon.ico).*)']
};
