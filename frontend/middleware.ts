import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["uk", "en"] as const;
type Locale = typeof locales[number];
const defaultLocale: Locale = "uk";

function getLocaleFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return locales.includes(segment as Locale) ? (segment as Locale) : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore next internals and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If no locale in path, rewrite to default
  const localeInPath = getLocaleFromPath(pathname);
  if (!localeInPath) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // If invalid locale somehow appears, normalize to default
  if (!locales.includes(localeInPath)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname.replace(/^\/[^/]+/, "")}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(?!_next|api|.*\\..*).*"],
};


