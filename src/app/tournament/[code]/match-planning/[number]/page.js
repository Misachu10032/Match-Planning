import MatchplanningDisplay from "@/components/MatchPlanningDisplay/MatchPlanningDisplay";
import { requireTournamentContext } from "@/lib/tournamentAuth";
import { fetchMatchPlanningPageData } from "@/lib/matchPlanningData";
import MatchScoreboard from "@/components/MatchScoreBoard/MatchScoreboard";

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

          <MatchScoreboard
            gameId={data.game.id}
            gameNumber={data.game.number}
            gameName={data.game.name}
            tournamentId={tournamentId}
            teamA={data.teams.a}
            teamB={data.teams.b}
            initialA={data.game.team_a_score}
            initialB={data.game.team_b_score}
          />
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
