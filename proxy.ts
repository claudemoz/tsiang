import { NextResponse, type NextRequest } from "next/server";

/**
 * French is the default locale and is served without a prefix (/, /projets, /lab…); English lives
 * under /en. Every page is built under app/[lang], so unprefixed paths are rewritten to /fr
 * internally, and /fr/… is redirected to its clean URL so each page has a single address.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  if (pathname === "/fr" || pathname.startsWith("/fr/")) {
    // Generated metadata files (Open Graph images) keep their internal /fr URL.
    if (pathname.includes("opengraph-image")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/fr${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: not the API, Next internals, metadata routes or files with an extension.
  matcher: ["/((?!api|_next/static|_next/image|icon|apple-icon|sitemap.xml|robots.txt|.*\\.[\\w]+$).*)"],
};
