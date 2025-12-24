import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const { code } = await req.json();
    const cleanCode = String(code || "").trim();

    if (!cleanCode) {
      return NextResponse.json(
        { error: "Missing code" },
        { status: 400 }
      );
    }

    // Check tournament existence
    const { data, error } = await supabaseAdmin
      .from("tournaments")
      .select("id, code")
      .eq("code", cleanCode)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { ok: false },
        { status: 404 }
      );
    }

    // Set cookies
    const res = NextResponse.json({
      ok: true,
      tournament_id: data.id,
      code: data.code,
    });

    res.cookies.set("tournament_id", String(data.id), {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    res.cookies.set("tournament_code", data.code, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
