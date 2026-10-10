import { motion } from "framer-motion";
import type { Monster } from "@/lib/data";

export function EncounterPanel({
  wildMonsters,
  teamOptions,
  selectedTeamId,
  selectedWildId,
  onTeamChange,
  onWildChange,
  onSubmit,
  isSubmitting,
}: {
  wildMonsters: Monster[];
  teamOptions: { id: string; name: string; monsterIds: string[] }[];
  selectedTeamId: string;
  selectedWildId: string;
  onTeamChange: (value: string) => void;
  onWildChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <motion.div layout className="card p-6">
      <h2 className="mb-4 text-2xl font-bold text-white">Start an encounter</h2>
      <div className="space-y-4">
        <label className="block text-sm text-slate-300">
          Select team
          <select value={selectedTeamId} onChange={(e) => onTeamChange(e.target.value)} disabled={isSubmitting} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white disabled:opacity-60">
            {teamOptions.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-slate-300">
          Wild monster
          <select value={selectedWildId} onChange={(e) => onWildChange(e.target.value)} disabled={isSubmitting} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white disabled:opacity-60">
            {wildMonsters.map((monster) => (
              <option key={monster.id} value={monster.id}>{monster.name}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !selectedTeamId || !selectedWildId}
          className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {isSubmitting ? "Resolving battle..." : "Battle"}
        </button>
      </div>
    </motion.div>
  );
}
