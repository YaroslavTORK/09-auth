import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_PREFIXES = ["/notes", "/profile"];
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthPath(pathname: string) {
  return AUTH_PREFIXES.some((p) => pathname.startsWith(p));
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken && refreshToken) {
    try {
      const sessionRes = await fetch(new URL("/api/auth/session", req.url), {
        method: "GET",
        headers: {
          Cookie: req.headers.get("cookie") ?? "",
        },
        cache: "no-store",
      });

      const raw = sessionRes.headers.get("set-cookie");
      const setCookies = raw ? [raw] : [];

      if (setCookies.length) {
        const res = NextResponse.next();
        for (const c of setCookies) res.headers.append("Set-Cookie", c);
        return res;
      }
    } catch {}
  }

  const isAuthed = Boolean(accessToken || refreshToken);

  if (!isAuthed && isPrivatePath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isAuthed && isAuthPath(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/notes/:path*", "/profile/:path*", "/sign-in", "/sign-up"],
};
