import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_VALUE = process.env.JWT_SECRET;

if (!JWT_SECRET_VALUE) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_VALUE);

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      id: string;
      role: "ADMIN" | "TEACHER" | "STUDENT";
    };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/backend")) {
    const backendUrl =
      process.env.API_BASE_URL ?? "https://takshahub.onrender.com";

    // 🟩 This rewrites "/api/backend/..." to "/api/..." on your Render server
    const cleanPath = pathname.replace("/api/backend", "/api");
    const targetUrl = new URL(cleanPath + req.nextUrl.search, backendUrl);

    return NextResponse.rewrite(targetUrl);
  }

  const token = req.cookies.get("token")?.value;
  const isLoginPage = pathname === "/login";

  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/student");

  const user = token ? await verifyToken(token) : null;

  if (isLoginPage && user) {
    return NextResponse.redirect(
      new URL(`/${user.role.toLowerCase()}`, req.url),
    );
  }

  if (isProtectedRoute) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/dashboard") {
      return NextResponse.redirect(
        new URL(`/${user.role.toLowerCase()}`, req.url),
      );
    }

    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/teacher") && user.role !== "TEACHER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (pathname.startsWith("/student") && user.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
