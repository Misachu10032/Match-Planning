// lib/tournamentData.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function fetchTeams(tournamentId) {
  const { data, error } = await supabaseAdmin
    .from("teams")
    .select("id, code")
    .eq("tournament_id", tournamentId)
    .order("code");

  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchGames(tournamentId) {
  const { data, error } = await supabaseAdmin
    .from("games")
    .select("id, number, name, team_a_id, team_b_id, team_a_score, team_b_score")
    .eq("tournament_id", tournamentId)
    .order("number");

  if (error) throw new Error(error.message);
  return data || [];
}

export function buildTeamCodeMap(teams) {
  return Object.fromEntries(teams.map((t) => [t.id, t.code]));
}

export async function fetchTournament(tournamentId) {
  const { data, error } = await supabaseAdmin
    .from("tournaments")
    .select("id, code, name, date, rules")
    .eq("id", tournamentId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}