// components/MatchScoreboard/MatchScoreboard.js
"use client";

import { useEffect, useMemo, useState } from "react";
import ScorePanel from "./ScorePanel";
import { clamp, toIntOr0 } from "./utils";

export default function MatchScoreboard({
  gameId,
  gameNumber,
  gameName,
  tournamentId,
  teamA, // { id, code }
  teamB, // { id, code }
  initialA, // DB: team_a_score
  initialB, // DB: team_b_score
  initialIfTeamAWon, // DB: if_team_a_won
}) {
  /* ---------------- baseline from DB ---------------- */
  const dbA = useMemo(() => toIntOr0(initialA), [initialA]);
  const dbB = useMemo(() => toIntOr0(initialB), [initialB]);

  const dbIfTeamAWon = useMemo(() => {
    if (initialIfTeamAWon === true) return true;
    if (initialIfTeamAWon === false) return false;
    return null;
  }, [initialIfTeamAWon]);

  /* ---------------- local state ---------------- */
  const [aScore, setAScore] = useState(dbA);
  const [bScore, setBScore] = useState(dbB);
  const [ifTeamAWon, setIfTeamAWon] = useState(dbIfTeamAWon);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  /* ---------------- sync when DB changes ---------------- */
  useEffect(() => {
    setAScore(dbA);
    setBScore(dbB);
    setIfTeamAWon(dbIfTeamAWon);
  }, [dbA, dbB, dbIfTeamAWon]);

  /* ---------------- dirty check ---------------- */
  const isDirty =
    aScore !== dbA ||
    bScore !== dbB ||
    ifTeamAWon !== dbIfTeamAWon;

  /* ---------------- score handlers ---------------- */
  const plusA = () => setAScore((s) => clamp(s + 1, 0, 999));
  const minusA = () => setAScore((s) => clamp(s - 1, 0, 999));
  const plusB = () => setBScore((s) => clamp(s + 1, 0, 999));
  const minusB = () => setBScore((s) => clamp(s - 1, 0, 999));

  /* ---------------- winner toggle handlers ---------------- */
  const toggleTeamAWin = () =>
    setIfTeamAWon((v) => (v === true ? null : true));

  const toggleTeamBWin = () =>
    setIfTeamAWon((v) => (v === false ? null : false));

  /* ---------------- save ---------------- */
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
          ifTeamAWon,
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

  /* ---------------- UI ---------------- */
  return (
    <section className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">
            Game #{gameNumber}
          </h2>

          {/* CLICKABLE TEAM NAMES */}
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
            <span
              onClick={toggleTeamAWin}
              className={`cursor-pointer rounded-full px-2 py-0.5 transition ${ifTeamAWon === true
                ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                : "hover:bg-gray-100"
                }`}
            >
              Team {teamA.code}
            </span>

            <span className="text-gray-400">vs</span>

            <span
              onClick={toggleTeamBWin}
              className={`cursor-pointer rounded-full px-2 py-0.5 transition ${ifTeamAWon === false
                ? "border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                : "hover:bg-gray-100"
                }`}
            >
              Team {teamB.code}
            </span>
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
        <div className="text-xs text-gray-500 min-h-[24px]">
          {isDirty ? "unsaved" : "   "}
        </div>

      </div>
    </section>
  );
}
