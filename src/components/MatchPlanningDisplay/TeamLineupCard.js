// components/TeamLineupCard.js
"use client";

import { useMemo, useState } from "react";
import { useIsTouchDevice } from "@/lib/useIsTouchDevice";

function reorder(list, fromIdx, toIdx) {
  const next = [...list];
  const [moved] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, moved);
  return next;
}

function swap(list, i, j) {
  const next = [...list];
  const tmp = next[i];
  next[i] = next[j];
  next[j] = tmp;
  return next;
}

function PlayerRow({
  idx,
  player,
  editable,
  enableDrag,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}) {
  return (
    <div
      draggable={enableDrag}
      onDragStart={enableDrag ? onDragStart : undefined}
      onDragOver={enableDrag ? onDragOver : undefined}
      onDrop={enableDrag ? onDrop : undefined}
      className={[
        "rounded-xl border bg-white px-3 py-2 sm:px-4 sm:py-3 select-none",
        editable ? "active:scale-[0.99]" : "",
        enableDrag ? "cursor-move hover:bg-gray-50" : "",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
      title={editable ? (enableDrag ? "Drag to reorder" : "Use ↑ ↓ to reorder") : ""}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-gray-800">#{idx + 1}</span>
            <span className="truncate text-sm text-gray-800">{player.name}</span>
          </div>
          <div className="mt-0.5 text-xs text-gray-500">Player{player.position}</div>
        </div>

        {/* ✅ Show ↑ ↓ ONLY when drag is disabled (iPhone / touch) */}
        {editable && !enableDrag ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={disableUp}
              className="rounded-lg border px-2 py-1 text-xs text-gray-700 disabled:opacity-40"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={disableDown}
              className="rounded-lg border px-2 py-1 text-xs text-gray-700 disabled:opacity-40"
            >
              ↓
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function TeamLineupCard({
  title,
  teamId,
  gameId,
  orderedPlayers, // [{id, name, position}, ...] already in current order
  editable = false,
}) {
  const isTouch = useIsTouchDevice();
  const enableDrag = editable && !isTouch; // ✅ drag on desktop/android, off on touch phones

  const initialIds = useMemo(() => orderedPlayers.map((p) => p.id), [orderedPlayers]);
  const playerById = useMemo(
    () => Object.fromEntries(orderedPlayers.map((p) => [p.id, p])),
    [orderedPlayers]
  );

  const [orderIds, setOrderIds] = useState(initialIds);
  const [dragIndex, setDragIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const currentPlayers = orderIds.map((id) => playerById[id]).filter(Boolean);

  const isDirty =
    orderIds.length === initialIds.length &&
    orderIds.some((id, i) => id !== initialIds[i]);

  async function save() {
    setMsg("");
    setSaving(true);

    try {
      const res = await fetch("/api/match-planning/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          teamId,
          orderedPlayerIds: orderIds, // <=7, server pads nulls
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
          <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
          {editable ? (
            <div className="mt-1 text-xs text-gray-500">
              {enableDrag ? "Drag to reorder." : "Use ↑ ↓ to reorder on phone."}
            </div>
          ) : null}
        </div>

        {editable ? (
          <button
            onClick={save}
            disabled={saving || !isDirty}
            className="rounded-xl bg-black px-3 py-2 text-white text-sm font-medium hover:bg-black/90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-2">
        {currentPlayers.map((p, idx) => (
          <PlayerRow
            key={p.id}
            idx={idx}
            player={p}
            editable={editable}
            enableDrag={enableDrag}
            isDragging={dragIndex === idx}
            onDragStart={() => setDragIndex(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex === null || dragIndex === idx) return;
              setOrderIds((prev) => reorder(prev, dragIndex, idx));
              setDragIndex(null);
            }}
            onMoveUp={() => setOrderIds((prev) => (idx === 0 ? prev : swap(prev, idx, idx - 1)))}
            onMoveDown={() =>
              setOrderIds((prev) =>
                idx === prev.length - 1 ? prev : swap(prev, idx, idx + 1)
              )
            }
            disableUp={idx === 0}
            disableDown={idx === currentPlayers.length - 1}
          />
        ))}
      </div>

      {editable && msg ? <div className="mt-3 text-sm text-gray-600">{msg}</div> : null}
    </section>
  );
}
