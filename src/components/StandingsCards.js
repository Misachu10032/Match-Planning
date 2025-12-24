// components/StandingsCards.js

export default function StandingsCards({ standings }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Team Wins</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {standings.map((s) => (
          <div key={s.team_id} className="rounded-xl border p-4">
            <div className="text-xs text-gray-500">Team</div>
            <div className="mt-1 text-2xl font-semibold">{s.team_code}</div>

            <div className="mt-2 text-sm text-gray-700">
              Wins: <span className="font-semibold">{s.wins}</span>
            </div>

            <div className="mt-1 text-sm text-gray-700">
              Total Points: <span className="font-semibold">{s.total_points}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
