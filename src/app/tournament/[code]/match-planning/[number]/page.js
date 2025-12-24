import MatchplanningDisplay from "@/components/MatchplanningDisplay";
import { requireTournamentContext } from "@/lib/tournamentAuth";
import { fetchMatchPlanningPageData } from "@/lib/matchPlanningData";

export default async function MatchPlanningPage({ params }) {
  // Next.js 15: params can be a Promise
  const { code: routeCode, number } = await params;
  const gameNumber = Number(number);

  if (!Number.isFinite(gameNumber) || gameNumber <= 0) {
    // simple guard
    throw new Error("Invalid game number");
  }

  // cookie guard: ensures tournament_id exists + code matches cookie
  const { tournamentId, code } = await requireTournamentContext(routeCode);

  // fetch everything needed for this page
  const data = await fetchMatchPlanningPageData({
    tournamentId,
    gameNumber,
  });

  const teamA = data.teams.a;
  const teamB = data.teams.b;

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <a
            className="text-sm text-gray-600 hover:underline"
            href={`/tournament/${code}`}
          >
            ← Back to games
          </a>

          <h1 className="text-2xl font-semibold">
            Match Planning — Game #{data.game.number}
          </h1>

          <p className="text-sm text-gray-600">
            {teamA?.code} vs {teamB?.code}
          </p>

          <div className="rounded-xl border bg-white p-4 text-sm text-gray-700">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <div>
                <span className="text-gray-500">Game name:</span>{" "}
                <span className="font-medium">{data.game.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Game ID:</span>{" "}
                <span className="font-medium">{data.game.id}</span>
              </div>
              <div>
                <span className="text-gray-500">Tournament ID:</span>{" "}
                <span className="font-medium">{tournamentId}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Two side-by-side lineups (Team A vs Team B) */}
        <MatchplanningDisplay
          gameId={data.game.id} 
          teams={data.teams}
          playersByTeamId={data.playersByTeamId}
          planByTeamId={data.planByTeamId}
        />
      </div>
    </main>
  );
}
