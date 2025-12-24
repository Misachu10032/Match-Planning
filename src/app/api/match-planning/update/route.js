import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const tournamentIdRaw = cookieStore.get("tournament_id")?.value;
    const tournamentId = Number(tournamentIdRaw);

    if (!Number.isFinite(tournamentId) || tournamentId <= 0) {
      return NextResponse.json(
        { error: "Not authorized (missing tournament cookie)", tournamentIdRaw },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Body must be JSON object", received: body },
        { status: 400 }
      );
    }

    const gameId = Number(body.gameId);
    const teamId = Number(body.teamId);
    const orderedPlayerIdsRaw = body.orderedPlayerIds;

    if (!Number.isFinite(gameId) || gameId <= 0) {
      return NextResponse.json(
        { error: "Invalid gameId", received: body.gameId },
        { status: 400 }
      );
    }

    if (!Number.isFinite(teamId) || teamId <= 0) {
      return NextResponse.json(
        { error: "Invalid teamId", received: body.teamId },
        { status: 400 }
      );
    }

    if (!Array.isArray(orderedPlayerIdsRaw)) {
      return NextResponse.json(
        { error: "orderedPlayerIds must be an array", received: orderedPlayerIdsRaw },
        { status: 400 }
      );
    }

    if (orderedPlayerIdsRaw.length > 7) {
      return NextResponse.json(
        { error: "orderedPlayerIds max length is 7", receivedLength: orderedPlayerIdsRaw.length },
        { status: 400 }
      );
    }

    // Coerce IDs to numbers (allow nulls)
    const orderedPlayerIds = orderedPlayerIdsRaw.map((x) =>
      x === null || x === undefined || x === "" ? null : Number(x)
    );

    if (orderedPlayerIds.some((x) => x !== null && (!Number.isFinite(x) || x <= 0))) {
      return NextResponse.json(
        { error: "orderedPlayerIds contains invalid values", received: orderedPlayerIdsRaw },
        { status: 400 }
      );
    }

    // Verify game belongs to tournament and team is in game
    const { data: game, error: gameErr } = await supabaseAdmin
      .from("games")
      .select("id, tournament_id, team_a_id, team_b_id")
      .eq("id", gameId)
      .single();

    if (gameErr) {
      return NextResponse.json({ error: gameErr.message }, { status: 500 });
    }
    if (game.tournament_id !== tournamentId) {
      return NextResponse.json({ error: "Unauthorized tournament access" }, { status: 403 });
    }
    if (teamId !== game.team_a_id && teamId !== game.team_b_id) {
      return NextResponse.json({ error: "Team not part of this game" }, { status: 400 });
    }

    // Build update patch
    const update = {};
    for (let i = 1; i <= 7; i++) {
      update[`position${i}`] = orderedPlayerIds[i - 1] ?? null;
    }

    const { error: upErr } = await supabaseAdmin
      .from("match_planning")
      .update(update)
      .eq("game_id", gameId)
      .eq("team_id", teamId);

    if (upErr) {
      return NextResponse.json({ error: upErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error", detail: String(err) }, { status: 500 });
  }
}
