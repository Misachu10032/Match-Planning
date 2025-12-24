// components/GamesGrid.js

function getWinnerFlags(aScore, bScore) {
  return {
    aWon: aScore === 50 && bScore !== 50,
    bWon: bScore === 50 && aScore !== 50,
  };
}

export default function GamesGrid({ code, games, teamCodeById }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Games</h2>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
        {games.map((g) => {
          const aCode = teamCodeById[g.team_a_id] ?? `#${g.team_a_id}`;
          const bCode = teamCodeById[g.team_b_id] ?? `#${g.team_b_id}`;

          const { aWon, bWon } = getWinnerFlags(
            g.team_a_score,
            g.team_b_score
          );

          return (
            <a
              key={g.id}
              href={`/tournament/${code}/match-planning/${g.number}`}
              className="aspect-[5/3] rounded-2xl border bg-white p-4 text-left shadow-sm
                         hover:bg-gray-50 active:scale-[0.99] transition"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Game</div>
                <div className="text-xs text-gray-500">#{g.number}</div>
              </div>

              {/* TEAM LINE (WINNER CIRCLED HERE) */}
              <div className="mt-2 flex items-center gap-2 text-base font-semibold">
                <span
                  className={`px-2 py-0.5 rounded-full ${
                    aWon
                      ? "border-2 border-green-500 bg-green-50 text-green-700"
                      : ""
                  }`}
                >
                  {aCode}
                </span>

                <span className="text-gray-500 font-normal">vs</span>

                <span
                  className={`px-2 py-0.5 rounded-full ${
                    bWon
                      ? "border-2 border-green-500 bg-green-50 text-green-700"
                      : ""
                  }`}
                >
                  {bCode}
                </span>
              </div>

              {/* SCORE LINE */}
              <div className="mt-2 text-sm text-gray-700">
                <span className={aWon ? "font-semibold" : ""}>
                  {aCode}: {g.team_a_score}
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className={bWon ? "font-semibold" : ""}>
                  {bCode}: {g.team_b_score}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
