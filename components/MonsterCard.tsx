import { motion } from "framer-motion";
import type { Monster } from "@/lib/data";

export function MonsterCard({
  monster,
  selected = false,
  onSelect,
}: {
  monster: Monster;
  selected?: boolean;
  onSelect?: (monster: Monster) => void;
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      className={`card overflow-hidden ${selected ? "border-violet-400/70 ring-2 ring-violet-500/40" : ""}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-cyan-500 to-teal-400 text-2xl shadow-lg">
          {monster.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-white">{monster.name}</h3>
            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase text-cyan-200">
              {monster.rarity}
            </span>
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">{monster.element}</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <p className="text-sm text-slate-300">{monster.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-200">
          <div className="rounded-lg bg-slate-900/70 p-2 text-center"><div className="text-slate-400">ATK</div><strong>{monster.attack}</strong></div>
          <div className="rounded-lg bg-slate-900/70 p-2 text-center"><div className="text-slate-400">DEF</div><strong>{monster.defense}</strong></div>
          <div className="rounded-lg bg-slate-900/70 p-2 text-center"><div className="text-slate-400">SPD</div><strong>{monster.speed}</strong></div>
        </div>
        {onSelect ? (
          <button onClick={() => onSelect(monster)} className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500">
            {selected ? "Selected" : "Select"}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}
