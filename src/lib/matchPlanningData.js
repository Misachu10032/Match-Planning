import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function fetchMatchPlanningPageData({ tournamentId, gameNumber }) {
  // 1) game
  const { data: game, error: gameErr } = await supabaseAdmin
    .from("games")
    .select("id, number, name, team_a_id, team_b_id, team_a_score, team_b_score,if_team_a_won")
    .eq("tournament_id", tournamentId)
    .eq("number", gameNumber)
    .single();

  if (gameErr) throw new Error(gameErr.message);

  const teamIds = [game.team_a_id, game.team_b_id];

  // 2) teams
  const { data: teams, error: teamsErr } = await supabaseAdmin
    .from("teams")
    .select("id, code")
    .in("id", teamIds);

  if (teamsErr) throw new Error(teamsErr.message);

  const teamById = Object.fromEntries((teams || []).map((t) => [t.id, t]));

  // 3) players for both teams
  const { data: players, error: playersErr } = await supabaseAdmin
    .from("players")
    .select("id, team_id, position, name")
    .in("team_id", teamIds)
    .order("team_id")
    .order("position");

  if (playersErr) throw new Error(playersErr.message);

  // group players by team_id
  const playersByTeamId = {};
  for (const p of players || []) {
    playersByTeamId[p.team_id] ??= [];
    playersByTeamId[p.team_id].push(p);
  }

  // 4) match_planning for both teams (2 rows)
  const { data: plans, error: planErr } = await supabaseAdmin
    .from("match_planning")
    .select("id, team_id, game_id, position1, position2, position3, position4, position5, position6, position7")
    .eq("game_id", game.id)
    .in("team_id", teamIds);

  if (planErr) throw new Error(planErr.message);

  const planByTeamId = Object.fromEntries((plans || []).map((r) => [r.team_id, r]));

  return {
    game,
    teams: {
      a: teamById[game.team_a_id],
      b: teamById[game.team_b_id],
    },
    playersByTeamId,
    planByTeamId,
  };
}
