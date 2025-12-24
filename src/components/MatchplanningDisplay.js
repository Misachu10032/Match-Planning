export default function MatchPlanningDisplay({
  teams,              // { a: {id, code}, b: {id, code} }
  playersByTeamId,    // { [teamId]: [{id, team_id, position, name}, ...] }
  planByTeamId,       // { [teamId]: { position1..position7 } }
}) {
  function buildLineup(teamId) {
    const players = playersByTeamId[teamId] || [];
    const playerById = Object.fromEntries(players.map((p) => [p.id, p]));

    const plan = planByTeamId[teamId] || {};

    const lineup = [];
    for (let slot = 1; slot <= 7; slot++) {
      const playerId = plan[`position${slot}`];
      const p = playerId ? playerById[playerId] : null;

      lineup.push({
        slot,                 // match slot 1..7
        playerId: playerId ?? null,
        name: p?.name ?? null,
        teamPosition: p?.position ?? null, // roster position 1..5
      });
    }
    return lineup;
  }

  const teamA = teams.a;
  const teamB = teams.b;

  const lineupA = buildLineup(teamA.id);
  const lineupB = buildLineup(teamB.id);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TeamList title={`Team ${teamA.code}`} lineup={lineupA} />
      <TeamList title={`Team ${teamB.code}`} lineup={lineupB} />
    </div>
  );
}

function TeamList({ title, lineup }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="mt-4 space-y-2">
        {lineup.map((row) => (
          <div
            key={row.slot}
            className="flex items-center justify-between rounded-xl border px-3 py-2"
          >
            <div className="text-sm text-gray-700">
              <span className="font-medium">#{row.slot}</span>
              <span className="ml-2">
                {row.name ? row.name : <span className="text-gray-400">(empty)</span>}
              </span>
            </div>

            <div className="text-xs text-gray-500">
              {row.teamPosition ? `P${row.teamPosition}` : ""}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
