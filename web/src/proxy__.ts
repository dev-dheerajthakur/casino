import { NextRequest, NextResponse } from "next/server";
import { validateAuthToken } from "./hooks/validate-auth-token";

const authPages = ["/login", "/register"]

export async function proxy(req: NextRequest) {
  const auth_token = req.cookies.get("auth_token");
  const pathname = req.nextUrl.pathname;
  const isOnAuthPage = authPages.includes(pathname);

  
  const { isValidToken, parsedToken } = await validateAuthToken(auth_token?.value);
  if(!isValidToken && isOnAuthPage) return NextResponse.next();
  if(!isValidToken && !isOnAuthPage) return redirectTo("/login")
  if(isValidToken && isOnAuthPage) return redirectTo("/casino")
  
  function redirectTo(pathname: string) {
    return NextResponse.redirect(new URL(pathname, req.url))
  }

  const res = NextResponse.next();
  res.headers.set("x-user-valid", "true")
  res.headers.set("x-user-name", parsedToken?.username);
  res.headers.set("x-user-profile", "/dheeraj/profile.png");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
