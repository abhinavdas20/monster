"use client";

import { useEffect, useState } from "react";
import { AuthPrompt } from "@/components/AuthPrompt";
import { useAuth } from "@/components/AuthProvider";
import { EncounterPanel } from "@/components/EncounterPanel";
import { BattleArena, type BattlePhase } from "@/components/BattleArena";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { ResultPanel } from "@/components/ResultPanel";
import { apiFetch } from "@/lib/api/client";
import type { Monster } from "@/lib/data";

export default function EncounterPage() {
  const { player } = useAuth();
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [teams, setTeams] = useState<Array<{ id: string; name: string; monsterIds: string[] }>>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedWildId, setSelectedWildId] = useState("");
  const [result, setResult] = useState<{ outcome: string; summary: string; rewardMonster?: { name: string } | null } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [battlePhase, setBattlePhase] = useState<BattlePhase>("ready");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player) return;
    Promise.all([
      apiFetch("/api/monsters").then((response) => response.json()),
      apiFetch("/api/teams").then((response) => response.json()),
    ])
      .then(([monsterPayload, teamPayload]) => {
        const nextMonsters = monsterPayload.monsters ?? [];
        const nextTeams = teamPayload.teams ?? [];
        setMonsters(nextMonsters);
        setTeams(nextTeams);
        setSelectedTeamId(nextTeams[0]?.id ?? "");
        setSelectedWildId(nextMonsters[0]?.id ?? "");
      })
      .catch(() => setError("Unable to load encounter data."));
  }, [player]);

  const onSubmit = async () => {
    if (!player || !selectedTeamId || !selectedWildId) {
      setError("Choose a team and a wild monster");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      setBattlePhase("approach");
      await new Promise((resolve) => setTimeout(resolve, 500));
      setBattlePhase("clash");
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await apiFetch("/api/encounters", {
        method: "POST",
        body: JSON.stringify({ teamId: selectedTeamId, wildMonsterId: selectedWildId }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setBattlePhase("ready");
        setError(payload.message ?? "Encounter failed to resolve.");
        return;
      }

      const reward = payload.encounter.rewardMonsterId
        ? monsters.find((monster) => monster.id === payload.encounter.rewardMonsterId)
        : null;
      const outcome = payload.encounter.outcome === "win" ? "Victory" : "Defeat";

      setResult({
        outcome,
        summary: payload.encounter.summary,
        rewardMonster: reward ? { name: reward.name } : null,
      });
      setBattlePhase(outcome === "Victory" ? "victory" : "defeat");
    } catch {
      setBattlePhase("ready");
      setError("Unable to resolve encounter. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!player) return <AuthPrompt />;
  if (error) return <ErrorMessage message={error} />;
  if (!monsters.length || !teams.length) return <LoadingState message="Preparing the arena..." />;

  const selectedTeam = teams.find((team) => team.id === selectedTeamId);
  const battleTeam = selectedTeam?.monsterIds.flatMap((monsterId) => {
    const monster = monsters.find((candidate) => candidate.id === monsterId);
    return monster ? [monster] : [];
  }) ?? [];
  const wildMonster = monsters.find((monster) => monster.id === selectedWildId) ?? monsters[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Arena</p>
        <h1 className="mt-2 text-3xl font-black text-white">Wild encounter</h1>
      </div>
      <BattleArena
        teamName={selectedTeam?.name ?? "Your team"}
        team={battleTeam}
        wildMonster={wildMonster}
        phase={battlePhase}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <EncounterPanel
          wildMonsters={monsters}
          teamOptions={teams}
          selectedTeamId={selectedTeamId}
          selectedWildId={selectedWildId}
          onTeamChange={setSelectedTeamId}
          onWildChange={setSelectedWildId}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
        {result ? <ResultPanel outcome={result.outcome} summary={result.summary} rewardMonster={result.rewardMonster} /> : <div className="card p-6 text-slate-300">No encounter resolved yet.</div>}
      </div>
    </div>
  );
}
