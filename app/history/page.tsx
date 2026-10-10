"use client";

import { useEffect, useState } from "react";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { AuthPrompt } from "@/components/AuthPrompt";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api/client";

type HistoryEntry = {
  id: string;
  outcome: "win" | "loss";
  summary: string;
  createdAt: string;
  wildMonsterId: string;
};

export default function HistoryPage() {
  const { player } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player) return;
    apiFetch("/api/history")
      .then((response) => response.json())
      .then((payload) => setHistory(payload.history ?? []))
      .catch(() => setError("Unable to load encounter history."));
  }, [player]);

  if (!player) return <AuthPrompt />;
  if (error) return <ErrorMessage message={error} />;
  if (!history.length) return <LoadingState message="Loading battle history..." />;

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-violet-300">History</p>
        <h1 className="mt-2 text-3xl font-black text-white">Encounter log</h1>
      </div>
      <div className="space-y-4">
        {history.map((entry) => (
          <div key={entry.id} className="card p-5">
            <div className="flex items-center justify-between gap-4">
              <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${entry.outcome === "win" ? "bg-emerald-500/15 text-emerald-200" : "bg-red-500/15 text-red-200"}`}>
                {entry.outcome}
              </span>
              <span className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{entry.summary}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">Wild monster: {entry.wildMonsterId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
