"use client";

import { useEffect, useState } from "react";
import { MonsterCard } from "@/components/MonsterCard";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { AuthPrompt } from "@/components/AuthPrompt";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api/client";
import type { Monster } from "@/lib/data";

export default function CollectionPage() {
  const { player } = useAuth();
  const [collection, setCollection] = useState<Monster[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player) return;
    apiFetch(`/api/players/${player.id}/collection`)
      .then((response) => response.json())
      .then((payload) => setCollection(payload.collection ?? []))
      .catch(() => setError("Unable to load collection."));
  }, [player]);

  if (!player) return <AuthPrompt />;
  if (error) return <ErrorMessage message={error} />;
  if (!collection.length) return <LoadingState message="Loading collection..." />;

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Collection</p>
        <h1 className="mt-2 text-3xl font-black text-white">Your monsters</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collection.map((monster) => (
          <MonsterCard key={monster.id} monster={monster} />
        ))}
      </div>
    </div>
  );
}
