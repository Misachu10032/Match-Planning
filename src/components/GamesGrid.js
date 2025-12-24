// components/GamesGrid.js

function winnerLabel({ aCode, bCode, aScore, bScore }) {
  const aWon = aScore === 50 && bScore !== 50;
  const bWon = bScore === 50 && aScore !== 50;

  if (aWon) return { done: true, text: `Winner: ${aCode}`, aBold: true, bBold: false };
  if (bWon) return { done: true, text: `Winner: ${bCode}`, aBold: false, bBold: true };
  return { done: false, text: "Not finished", aBold: false, bBold: false };
}

export default function GamesGrid({ code, games, teamCodeById }) {
  return (
    <section>
      <h2 className="text-lg font-semibold">Games</h2>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
        {games.map((g) => {
          const aCode = teamCodeById[g.team_a_id] ?? `#${g.team_a_id}`;
          const bCode = teamCodeById[g.team_b_id] ?? `#${g.team_b_id}`;

          const status = winnerLabel({
            aCode,
            bCode,
            aScore: g.team_a_score,
            bScore: g.team_b_score,
          });

          return (
            <a
              key={g.id}
              href={`/tournament/${code}/match-planning/${g.number}`}
              className="aspect-[5/3] rounded-2xl border bg-white p-4 text-left shadow-sm hover:bg-gray-50 active:scale-[0.99] transition"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Game</div>
                <div className="text-xs text-gray-500">#{g.number}</div>
              </div>

              <div className="mt-2 text-base font-semibold">
                {aCode} vs {bCode}
              </div>

              <div className="mt-2 text-sm text-gray-700">
                <span className={status.aBold ? "font-semibold" : ""}>
                  {aCode}: {g.team_a_score}
                </span>
                <span className="mx-2 text-gray-400">|</span>
                <span className={status.bBold ? "font-semibold" : ""}>
                  {bCode}: {g.team_b_score}
                </span>
              </div>

              <div className="mt-2 text-xs text-gray-500">{status.text}</div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
