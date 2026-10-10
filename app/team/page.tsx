"use client";

import { useEffect, useState } from "react";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { TeamSelector } from "@/components/TeamSelector";
import { AuthPrompt } from "@/components/AuthPrompt";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api/client";
import type { Monster } from "@/lib/data";

export default function TeamPage() {
  const { player } = useAuth();
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [teams, setTeams] = useState<Array<{ id: string; name: string; monsterIds: string[] }>>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [teamName, setTeamName] = useState("My New Squad");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player) return;
    Promise.all([
      apiFetch("/api/monsters").then((response) => response.json()),
      apiFetch("/api/teams").then((response) => response.json()),
    ])
      .then(([monsterPayload, teamPayload]) => {
        setMonsters(monsterPayload.monsters ?? []);
        setTeams(teamPayload.teams ?? []);
        const firstTeam = (teamPayload.teams ?? [])[0];
        if (firstTeam) setSelectedIds(firstTeam.monsterIds);
      })
      .catch(() => setError("Unable to load monsters and teams."));
  }, [player]);

  const toggleMonster = (monsterId: string) => {
    setSelectedIds((current) => {
      if (current.includes(monsterId)) return current.filter((id) => id !== monsterId);
      if (current.length >= 3) return current;
      return [...current, monsterId];
    });
  };

  const submitTeam = async () => {
    if (!selectedIds.length) {
      setMessage("Select at least one monster");
      return;
    }

    const response = await apiFetch("/api/teams", {
      method: "POST",
      body: JSON.stringify({ name: teamName, monsterIds: selectedIds }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setError(payload.message ?? "Unable to save team.");
      return;
    }

    setMessage(`Saved team: ${payload.team.name}`);
    setTeams((current) => [...current, payload.team]);
    setSelectedIds(payload.team.monsterIds);
  };

  if (!player) return <AuthPrompt />;
  if (error) return <ErrorMessage message={error} />;
  if (!monsters.length) return <LoadingState message="Loading team builder..." />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Team</p>
        <h1 className="mt-2 text-3xl font-black text-white">Build your battle squad</h1>
      </div>

      <div className="card p-6">
        <label className="block text-sm text-slate-300">
          Team name
          <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white" />
        </label>
        <div className="mt-4">
          <TeamSelector monsters={monsters} selectedIds={selectedIds} onToggle={toggleMonster} />
        </div>
        <button onClick={submitTeam} className="mt-6 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-500">
          Save team
        </button>
        {message ? <p className="mt-4 text-sm text-emerald-300">{message}</p> : null}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-white">Saved teams</h2>
        <div className="mt-4 space-y-3">
          {teams.map((team) => (
            <div key={team.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
              <div className="font-semibold text-white">{team.name}</div>
              <div className="text-sm text-slate-300">{team.monsterIds.length} monsters</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
