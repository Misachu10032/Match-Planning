// lib/standings.js

export function computeWinsByTeamId(games) {
  const wins = {};

  for (const g of games) {
    const aId = g.team_a_id;
    const bId = g.team_b_id;

    wins[aId] ??= 0;
    wins[bId] ??= 0;

    // rule: score 50 means win
    const aWon = g.team_a_score === 50 && g.team_b_score !== 50;
    const bWon = g.team_b_score === 50 && g.team_a_score !== 50;

    if (aWon) wins[aId] += 1;
    if (bWon) wins[bId] += 1;
  }

  return wins;
}
export function computeTotalPointsByTeamId(games) {
  const totals = {};

  for (const g of games) {
    const a = Number(g.team_a_score ?? 0);
    const b = Number(g.team_b_score ?? 0);

    totals[g.team_a_id] = (totals[g.team_a_id] ?? 0) + a;
    totals[g.team_b_id] = (totals[g.team_b_id] ?? 0) + b;
  }

  return totals;
}