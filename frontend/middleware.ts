import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // 정적 파일 경로는 무시
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  console.log("Middleware hit!");
  console.log("Requested URL:", request.url);

  return NextResponse.next();
}
export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*"],
};
