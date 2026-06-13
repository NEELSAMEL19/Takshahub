import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyToken(token: string) {
  try {
    console.log("🔍 Verifying token...");

    const { payload } = await jwtVerify(token, JWT_SECRET);

    console.log("✅ Token valid:", payload);

    return payload as {
      id: string;
      role: "ADMIN" | "TEACHER" | "STUDENT";
    };
  } catch (error) {
    console.log("❌ JWT verification failed:", error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  console.log("\n======================");
  console.log("📍 Path:", pathname);
  console.log("🍪 Token exists:", !!token);
  console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);

  const isLoginPage = pathname === "/login";

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/student");

  const user = token ? await verifyToken(token) : null;

  console.log("👤 User:", user);

  if (isLoginPage && user) {
    console.log(
      `↪️ Logged in user visiting login page. Redirecting to /${user.role.toLowerCase()}`,
    );

    return NextResponse.redirect(
      new URL(`/${user.role.toLowerCase()}`, req.url),
    );
  }

  if (isProtectedRoute) {
    if (!user) {
      console.log("⛔ No valid user. Redirecting to /login");

      const res = NextResponse.redirect(new URL("/login", req.url));

      if (token) {
        console.log("🗑️ Deleting invalid token");
        res.cookies.delete("token");
      }

      return res;
    }

    console.log("🎭 User role:", user.role);

    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      console.log("🚫 Admin access denied");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/teacher") && user.role !== "TEACHER") {
      console.log("🚫 Teacher access denied");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/student") && user.role !== "STUDENT") {
      console.log("🚫 Student access denied");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  console.log("✅ Allow request");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
