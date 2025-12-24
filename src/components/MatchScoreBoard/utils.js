// components/MatchScoreboard/utils.js

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function toIntOr0(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
