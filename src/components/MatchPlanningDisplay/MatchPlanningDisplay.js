// components/MatchPlanningDisplay.js
import TeamLineupCard from "@/components/MatchPlanningDisplay/TeamLineupCard";
import { buildOrderedPlayers } from "@/lib/buildMatchPlanningView";

export default function MatchPlanningDisplay({
  gameId,
  teams,
  playersByTeamId,
  planByTeamId,
  editable = true,
}) {
  const teamA = teams.a;
  const teamB = teams.b;

  const orderedA = buildOrderedPlayers({ teamId: teamA.id, playersByTeamId, planByTeamId, maxSlots: 7 });
  const orderedB = buildOrderedPlayers({ teamId: teamB.id, playersByTeamId, planByTeamId, maxSlots: 7 });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TeamLineupCard
        title={`Team ${teamA.code}`}
        teamId={teamA.id}
        gameId={gameId}
        orderedPlayers={orderedA}
        editable={editable}
      />
      <TeamLineupCard
        title={`Team ${teamB.code}`}
        teamId={teamB.id}
        gameId={gameId}
        orderedPlayers={orderedB}
        editable={editable}
      />
    </div>
  );
}
