// components/MatchScoreboard/MatchScoreboard.js
"use client";

import { useEffect, useMemo, useState } from "react";
import ScorePanel from "./ScorePanel";
import { clamp, toIntOr0 } from "./utils";

export default function MatchScoreboard({
  gameId,
  gameNumber,
  teamA, // { id, code }
  teamB, // { id, code }
  initialA, // from DB: data.game.team_a_score
  initialB, // from DB: data.game.team_b_score
}) {
  // baseline from DB
  const dbA = useMemo(() => toIntOr0(initialA), [initialA]);
  const dbB = useMemo(() => toIntOr0(initialB), [initialB]);

  const [aScore, setAScore] = useState(dbA);
  const [bScore, setBScore] = useState(dbB);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setAScore(dbA);
    setBScore(dbB);
  }, [dbA, dbB]);

  const isDirty = aScore !== dbA || bScore !== dbB;

  const plusA = () => setAScore((s) => clamp(s + 1, 0, 999));
  const minusA = () => setAScore((s) => clamp(s - 1, 0, 999));
  const plusB = () => setBScore((s) => clamp(s + 1, 0, 999));
  const minusB = () => setBScore((s) => clamp(s - 1, 0, 999));

  async function save() {
    setMsg("");
    setSaving(true);

    try {
      const res = await fetch("/api/games/update-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          teamAScore: aScore,
          teamBScore: bScore,
        }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setMsg(j.error || "Save failed");
        return;
      }

      setMsg("Saved!");
    } catch {
      setMsg("Network error");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 1500);
    }
  }

  return (
    <section className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            Game #{gameNumber}
          </h2>
          <div className="mt-1 text-sm text-gray-600">
            Team {teamA.code} vs Team {teamB.code}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving || !isDirty}
          className="rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-black/90 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScorePanel
          teamLabel={`Team ${teamA.code}`}
          score={aScore}
          onMinus={minusA}
          onPlus={plusA}
        />
        <ScorePanel
          teamLabel={`Team ${teamB.code}`}
          score={bScore}
          onMinus={minusB}
          onPlus={plusB}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">{msg}</div>
        {isDirty ? <div className="text-xs text-gray-500">Unsaved</div> : null}
      </div>
    </section>
  );
}
