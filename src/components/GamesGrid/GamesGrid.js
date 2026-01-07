// components/GamesGrid.js

export default function GamesGrid({ code, games, teamCodeById }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Games</h2>

      {/* 🔒 Keep 3 columns */}
      <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
        {games.map((g) => {
          const aCode = teamCodeById[g.team_a_id] ?? `#${g.team_a_id}`;
          const bCode = teamCodeById[g.team_b_id] ?? `#${g.team_b_id}`;

          return (
            <a
              key={g.id}
              href={`/tournament/${code}/match-planning/${g.number}`}
              className="
                aspect-[5/3]
                rounded-2xl
                border
                bg-white
                shadow-sm
                transition
                hover:bg-gray-50
                active:scale-[0.99]
                p-2 sm:p-4
              "
            >
              {/* HEADER */}
              <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                <div>Game</div>
                <div>#{g.number}</div>
              </div>

              {/* TEAM LINE */}
              <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold">
                {/* TEAM A */}
                <span
                  className={`px-1.5 py-0.5 rounded-full truncate max-w-full ${
                    g.if_team_a_won === true
                      ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-700"
                      : ""
                  }`}
                >
                  {aCode}
                </span>

                <span className="text-gray-500 font-normal text-xs sm:text-sm">
                  vs
                </span>

                {/* TEAM B */}
                <span
                  className={`px-1.5 py-0.5 rounded-full truncate max-w-full ${
                    g.if_team_a_won === false
                      ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-700"
                      : ""
                  }`}
                >
                  {bCode}
                </span>
              </div>

              {/* SCORE LINE */}
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 truncate">
                <span className={g.if_team_a_won === true ? "font-semibold" : ""}>
                  {aCode}: {g.team_a_score}
                </span>
                <span className="mx-1 sm:mx-2 text-gray-400">|</span>
                <span className={g.if_team_a_won === false ? "font-semibold" : ""}>
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
