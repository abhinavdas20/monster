"use client";

import { useEffect, useState } from "react";
import { MonsterCard } from "@/components/MonsterCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import type { Monster } from "@/lib/data";

export default function MonstersPage() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/monsters")
      .then((response) => response.json())
      .then((payload) => setMonsters(payload.monsters ?? []))
      .catch(() => setError("Unable to load monsters."));
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (!monsters.length) return <LoadingState message="Loading monsters..." />;

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Roster</p>
        <h1 className="mt-2 text-3xl font-black text-white">Available monsters</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {monsters.map((monster) => (
          <MonsterCard key={monster.id} monster={monster} />
        ))}
      </div>
    </div>
  );
}
