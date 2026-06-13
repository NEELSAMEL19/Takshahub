import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, API_ENDPOINTS } from "@/service/routes";

const normalizeSetCookie = (cookie: string) => {
  const parts = cookie
    .split(/;\s*/)
    .filter((part) => !/^Domain=/i.test(part) && !/^Path=/i.test(part));

  const hasSameSite = parts.some((part) => /^SameSite=/i.test(part));

  return `${parts.join("; ")}; Path=/${hasSameSite ? "" : "; SameSite=Lax"}`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const upstreamResponse = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
        credentials: "include",
      },
    );

    const responseText = await upstreamResponse.text();
    const contentType =
      upstreamResponse.headers.get("content-type") || "application/json";

    const response = new NextResponse(responseText, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: {
        "Content-Type": contentType,
      },
    });

    const setCookie = upstreamResponse.headers.get("set-cookie");

    if (setCookie) {
      response.headers.append("Set-Cookie", normalizeSetCookie(setCookie));
    }

    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
