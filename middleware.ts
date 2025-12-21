import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 保護されたルート（認証が必要なパス）
const protectedRoutes = [
  "/dashboard",
  "/meals",
  "/workouts",
  "/goals",
  "/progress",
  "/settings",
];

// 公開ルート（認証不要なパス）
const publicRoutes = ["/", "/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // セッショントークンの確認
  const sessionToken = request.cookies.get("better-auth.session_token");

  // 保護されたルートへのアクセス
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 認証が必要なルートにアクセスしようとしているが、セッションがない場合
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ログイン済みユーザーが認証ページにアクセスした場合
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
};

