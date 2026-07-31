import { NextRequest, NextResponse } from "next/server";
import { getDefaultRoute, routeAccess } from "./lib/roleAccess";
import { decrypt } from "./lib/session";

// const protectedRoutes = [
//     "/dashboard", "/pembelian", "/laporan", "/daftarPelanggan", "/daftarSupplier",
//     "/daftarItem", "/daftarKasir"
// ];
const publicRoutes = ["/login"];
const authRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    // const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isProtectedRoute = !publicRoutes.some((route) => path === route || path.startsWith(route + "/"));
    const isAuthRoute = authRoutes.includes(path);

    const cookies = req.cookies.get("session")?.value;
    const session = await decrypt(cookies);

    if(isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isAuthRoute && session?.userId) {
        const target = getDefaultRoute(session.role);
        if (target !== path) {
            return NextResponse.redirect(new URL(target, req.nextUrl));
        }
    }

    if (isProtectedRoute && session?.userId) {
        const matchedRoute = Object.keys(routeAccess).find(
            (route) => path === route || path.startsWith(route + "/")
        );

        if (matchedRoute && !routeAccess[matchedRoute].includes(session.role)) {
            return NextResponse.redirect(new URL(getDefaultRoute(session.role), req.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}