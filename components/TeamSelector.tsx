import type { Monster } from "@/lib/data";

export function TeamSelector({
  monsters,
  selectedIds,
  onToggle,
}: {
  monsters: Monster[];
  selectedIds: string[];
  onToggle: (monsterId: string) => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {monsters.map((monster) => {
        const isSelected = selectedIds.includes(monster.id);
        return (
          <button
            key={monster.id}
            type="button"
            onClick={() => onToggle(monster.id)}
            className={`rounded-2xl border p-3 text-left transition ${
              isSelected ? "border-cyan-400 bg-cyan-500/10 text-cyan-100" : "border-slate-700 bg-slate-900/60 text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{monster.name}</span>
              <span>{monster.emoji}</span>
            </div>
            <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{monster.element}</div>
          </button>
        );
      })}
    </div>
  );
}
