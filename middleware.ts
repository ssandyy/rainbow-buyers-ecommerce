import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { WEBSITE_FORGOT_PASSWORD, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SIGNUP } from "./routes/WebsiteRoutes";

export async function middleware(request: NextRequest) {
    const publicPaths = [WEBSITE_LOGIN, WEBSITE_SIGNUP, WEBSITE_FORGOT_PASSWORD, "/auth/verify-otp", "/auth/verify-email"];
    try {

        const isPublicPath = (path: string) => publicPaths.some((p) => path === p || path.startsWith(p + "/"));
        const pathname = request.nextUrl.pathname;

        const token = request.cookies.get("access_token");

        // public routes
        if (!token && isPublicPath(pathname)) {
            return NextResponse.next();
        }

        // Redirect unauthenticated users
        if (!token) {
            return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
        }

        //Verify JWT
        const { payload } = await jwtVerify(
            token.value,
            new TextEncoder().encode(process.env.SECRET_KEY)
        );

        const current_user_role = String(payload.role || "user");


        if (isPublicPath(pathname)) {
            return NextResponse.redirect(new URL(WEBSITE_HOME, request.url));
        }

        // Restrict /auth/(admin) app section and /admin/* → only admins
        if ((pathname.startsWith("/auth/") && pathname.includes("/admin")) || pathname.startsWith("/admin")) {
            if (current_user_role !== "admin" && current_user_role !== "superadmin") {
                return NextResponse.redirect(new URL(WEBSITE_HOME, request.url));
            }
        }

        // Restrict /my-account/* → authenticated users (any role allowed)
        if (pathname.startsWith("/my-account")) {
            // already authenticated above; no role restriction beyond auth
            return NextResponse.next();
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error);
        // If token is invalid/expired, clear it to avoid loops
        const response = NextResponse.next();
        response.cookies.set("access_token", "", { httpOnly: true, path: "/", expires: new Date(0) });

        const url = new URL(request.url);
        const pathname = url.pathname;
        // const publicPaths = [WEBSITE_LOGIN, WEBSITE_SIGNUP, WEBSITE_FORGOT_PASSWORD, "/auth/verify-otp", "/auth/verify-email"];
        const isPublicPath = (path: string) => publicPaths.some((p) => path === p || path.startsWith(p + "/"));

        // If we're already on a public/auth page, allow loading the page
        if (isPublicPath(pathname)) {
            return response;
        }

        // Otherwise, redirect to login once with cleared cookie
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};
