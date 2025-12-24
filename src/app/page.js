"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmed = code.trim();
    if (!trimmed) {
      setError("Please enter a code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/tournament/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });

      if (!res.ok) {
        setError("Invalid tournament code.");
        return;
      }

      // ✅ cookies are now set by the server
      router.push(`/tournament/${trimmed}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Tournament Entry</h1>
        <p className="mt-1 text-sm text-gray-600">
          Enter your tournament code to continue.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. 1231"
            className="w-full rounded-xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black/10"
          />

          {error && (
            <div className="text-sm text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 text-white font-medium hover:bg-black/90 disabled:opacity-60"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
