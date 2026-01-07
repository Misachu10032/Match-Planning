import { requireTournamentContext } from "@/lib/tournamentAuth";
import { fetchGames, fetchTeams, fetchTournament } from "@/lib/tournamentData";
import TournamentLive from "@/components/TournamentLive";

export default async function TournamentPage({ params }) {
  const { code: routeCode } = await params;

  // Get tournament context (checks code/cookies)
  const { tournamentId, code } = await requireTournamentContext(routeCode);

  // Fetch initial data (server-side)
  const [tournament, teams, games] = await Promise.all([
    fetchTournament(tournamentId),
    fetchTeams(tournamentId),
    fetchGames(tournamentId),
  ]);

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">{tournament.name}</h1>
            <p className="mt-1 text-sm text-gray-600">赛制: {tournament.rules}</p>
          </div>

          <form action="/api/tournament/logout" method="post">
            <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
              Change code
            </button>
          </form>
        </header>

        {/* Client-side live component */}
        <TournamentLive
          initialGames={games}
          initialTeams={teams}
          tournamentId={tournamentId} // needed for subscription filter
          code={code}
        />
      </div>
    </main>
  );
}
