import { NextResponse, type NextRequest } from "next/server";

// Cookie-based gate. The backend still checks the token on every call; this only saves a round trip
// and keeps signed-out users off /type/* and signed-in users off the auth forms.
export function proxy(request: NextRequest) {
  const signedIn = Boolean(request.cookies.get("accessToken")?.value);
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  if (!signedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (signedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/type/practice", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/type/:path*", "/login", "/signup"],
};
