// app/api/games/update-score/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    // 1) Auth via tournament cookie
    const cookieStore = await cookies();
    const tournamentIdRaw = cookieStore.get("tournament_id")?.value;
    const tournamentId = Number(tournamentIdRaw);

    if (!Number.isFinite(tournamentId) || tournamentId <= 0) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // 2) Parse payload
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Body must be JSON" }, { status: 400 });
    }

    const gameId = Number(body.gameId);
    const teamAScore = Number(body.teamAScore);
    const teamBScore = Number(body.teamBScore);

    // 👇 NEW: winner field
    const ifTeamAWon =
      body.ifTeamAWon === true
        ? true
        : body.ifTeamAWon === false
        ? false
        : null;

    if (!Number.isFinite(gameId) || gameId <= 0) {
      return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });
    }
    if (!Number.isFinite(teamAScore) || teamAScore < 0 || teamAScore > 999) {
      return NextResponse.json({ error: "Invalid teamAScore" }, { status: 400 });
    }
    if (!Number.isFinite(teamBScore) || teamBScore < 0 || teamBScore > 999) {
      return NextResponse.json({ error: "Invalid teamBScore" }, { status: 400 });
    }

    // 3) Verify game belongs to this tournament
    const { data: game, error: gameErr } = await supabaseAdmin
      .from("games")
      .select("id, tournament_id")
      .eq("id", gameId)
      .single();

    if (gameErr) {
      return NextResponse.json({ error: gameErr.message }, { status: 500 });
    }
    if (game.tournament_id !== tournamentId) {
      return NextResponse.json(
        { error: "Unauthorized tournament access" },
        { status: 403 }
      );
    }

    // 4) Update scores + winner
    const { error: upErr } = await supabaseAdmin
      .from("games")
      .update({
        team_a_score: teamAScore,
        team_b_score: teamBScore,
        if_team_a_won: ifTeamAWon, // 👈 NEW
      })
      .eq("id", gameId);

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", detail: String(err) },
      { status: 500 }
    );
  }
}
