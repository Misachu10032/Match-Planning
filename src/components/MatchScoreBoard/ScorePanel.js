// components/MatchScoreboard/ScorePanel.js
"use client";

export default function ScorePanel({ teamLabel, score, onMinus, onPlus }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-center text-sm font-semibold text-gray-700">
        {teamLabel}
      </div>

      <div className="mt-2 text-center text-6xl font-bold tracking-tight sm:text-7xl">
        {score}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onMinus}
          className="rounded-2xl border py-4 text-2xl font-semibold active:scale-[0.99]"
          aria-label={`Minus 1 for ${teamLabel}`}
        >
          −
        </button>

        <button
          type="button"
          onClick={onPlus}
          className="rounded-2xl border py-4 text-2xl font-semibold active:scale-[0.99]"
          aria-label={`Plus 1 for ${teamLabel}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
