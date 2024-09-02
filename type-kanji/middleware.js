import { NextRequest, NextResponse } from 'next/server';

// Define a list of protected routes and restricted pages
const protectedRoutes = ['/practice', '/test'];
const restrictedPages = ['/login', '/signup'];

// Middleware function
export function middleware(req) {
  // Get the requested URL
  const url = req.nextUrl.clone();

  // Check if the request URL is a protected route
  if (protectedRoutes.includes(url.pathname)) {
    const isLoggedIn = Boolean(req.cookies.get('authToken')); // Example using cookies

    if (!isLoggedIn) {
      // Redirect to the login page if not logged in
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Check if the request URL is a restricted page and the user is already logged in
  if (restrictedPages.includes(url.pathname)) {
    const isLoggedIn = Boolean(req.cookies.get('authToken')); // Example using cookies

    if (isLoggedIn) {
      // Redirect to the home page or another appropriate page if already logged in
      url.pathname = '/'; // You can change this to where you want to redirect logged-in users
      return NextResponse.redirect(url);
    }
  }

  // Continue to the requested route if conditions are met
  return NextResponse.next();
}

// Define which paths this middleware applies to
export const config = {
  matcher: ['/practice', '/test', '/login', '/signup', '/'], // Include other paths if needed
};
