import { NextRequest, NextResponse } from "next/server";

// Define a list of protected routes
const protectedRoutes = ["/practice", "/test"];

// Middleware function
export function middleware(req) {
  // Get the requested URL
  const url = req.nextUrl.clone();

  // Check if the request URL is a protected route
  if (protectedRoutes.includes(url.pathname)) {
    // Replace this with your actual logic to check if the user is logged in
    const isLoggedIn = Boolean(req.cookies.get("authToken")); // Example using cookies

    if (!isLoggedIn) {
      // Redirect to the login page if not logged in
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Continue to the requested route if logged in or if not a protected route
  return NextResponse.next();
}

// Define which paths this middleware applies to
export const config = {
  matcher: ["/practice", "/test", "/"], // Include other paths if needed
};
