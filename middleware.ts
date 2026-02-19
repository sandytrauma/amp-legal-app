import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // ROLE-BASED PROTECTION: 
    // If trying to access /admin but role is not ADMIN, redirect to dashboard
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      // The middleware only runs if authorized returns true
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Define which paths are protected
export const config = { 
  matcher: [
    "/dashboard/:path*", 
    "/tasks/:path*", 
    "/hearings/:path*", 
    "/admin/:path*",
    "/statutory/:path*"
  ] 
};