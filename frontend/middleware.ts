import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/i18n/config';

export function middleware(request: any) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((loc) => pathname.startsWith(`/${loc}`));

  if (!hasLocale && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|fonts).*)'],
};


