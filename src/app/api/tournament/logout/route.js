import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.redirect(new URL("/", "http://localhost:3000"));

  // Clear cookies
  res.cookies.set("tournament_id", "", {
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("tournament_code", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
