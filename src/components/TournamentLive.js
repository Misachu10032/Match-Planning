"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";
import StandingsCards from "@/components/StandingsCards";
import GamesGrid from "@/components/GamesGrid/GamesGrid";
import { computeWinsByTeamId, computeTotalPointsByTeamId } from "@/lib/standings";

export default function TournamentLive({ initialGames, initialTeams, tournamentId,code }) {
  const [games, setGames] = useState(initialGames);
  const [teams] = useState(initialTeams);

  // Compute standings
  const winsByTeamId = computeWinsByTeamId(games);

  const totalPointsByTeamId = computeTotalPointsByTeamId(games);
  const standings = teams.map((t) => ({
    team_id: t.id,
    team_code: t.code,
    wins: winsByTeamId[t.id] ?? 0,
    total_points: totalPointsByTeamId[t.id] ?? 0,
  }));

  useEffect(() => {
    // Subscribe to all changes in games for this tournament
    const channel = supabaseClient
      .channel("games-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "games",
          filter: `tournament_id=eq.${tournamentId}`,
        },
        (payload) => {
          console.log("Game changed:", payload);
          setGames((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex((g) => g.id === payload.new?.id);
            if (payload.eventType === "DELETE") {
              // remove deleted game
              return updated.filter((g) => g.id !== payload.old.id);
            }
            if (idx !== -1 && payload.new) {
              // update existing
              updated[idx] = payload.new;
            } else if (payload.new) {
              // insert new
              updated.push(payload.new);
            }
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [tournamentId]);

  return (
    <div className="space-y-6">
      <StandingsCards standings={standings} />
      <GamesGrid
        games={games}
         code={code}
        teamCodeById={Object.fromEntries(teams.map((t) => [t.id, t.code]))}

      />
    </div>
  );
}
