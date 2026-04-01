import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));

  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      const setCookie = response.headers["set-cookie"];

      if (setCookie) {
        const res = isPublic
          ? NextResponse.redirect(new URL("/", request.url))
          : NextResponse.next();

        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options = {
            path: parsed.Path || "/",
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          };

          if (parsed.accessToken) {
            res.cookies.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            res.cookies.set("refreshToken", parsed.refreshToken, options);
          }
        }
        return res;
      }
    } catch {
      const res = NextResponse.redirect(new URL("/sign-in", request.url));
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  if (!accessToken && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
