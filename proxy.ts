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
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/login";

  const isProtectedRoute = pathname === "/dashboard";

  const user = token ? await verifyToken(token) : null;

  if (isLoginPage && user) {
    return NextResponse.redirect(
      new URL(`/${user.role.toLowerCase()}`, req.url),
    );
  }

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
