import StandingsCards from "@/components/StandingsCards";
import GamesGrid from "@/components/GamesGrid";

import { requireTournamentContext } from "@/lib/tournamentAuth";
import { fetchGames, fetchTeams, fetchTournament, buildTeamCodeMap } from "@/lib/tournamentData";
import { computeWinsByTeamId } from "@/lib/standings";

export default async function TournamentPage({ params }) {
  // ✅ Next 15: params can be a Promise
  const { code: routeCode } = await params;

  // ✅ must await because it reads cookies and may redirect
  const { tournamentId, code } = await requireTournamentContext(routeCode);

  const [tournament, teams, games] = await Promise.all([
    fetchTournament(tournamentId),
    fetchTeams(tournamentId),
    fetchGames(tournamentId),
  ]);

  const teamCodeById = buildTeamCodeMap(teams);
  const winsByTeamId = computeWinsByTeamId(games);

  const standings = teams.map((t) => ({
    team_id: t.id,
    team_code: t.code,
    wins: winsByTeamId[t.id] ?? 0,
  }));

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">
              {tournament.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              赛制: {tournament.rules}
            </p>
          </div>

          <form action="/api/tournament/logout" method="post">
            <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
              Change code
            </button>
          </form>
        </header>

        <StandingsCards standings={standings} />
        <GamesGrid code={code} games={games} teamCodeById={teamCodeById} />
      </div>
    </main>
  );
}
