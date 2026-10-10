import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { Monster } from "@/lib/data";

export type BattlePhase = "ready" | "approach" | "clash" | "victory" | "defeat";

const phaseLabels: Record<BattlePhase, string> = {
  ready: "Your team is facing a wild monster",
  approach: "Your team charges into battle!",
  clash: "The monsters collide!",
  victory: "Victory! Your team wins!",
  defeat: "Defeat! The wild monster wins!",
};

export function BattleArena({
  teamName,
  team,
  wildMonster,
  phase,
}: {
  teamName: string;
  team: Monster[];
  wildMonster: Monster;
  phase: BattlePhase;
}) {
  const reducedMotion = useReducedMotion();
  const teamOffset = phase === "approach" ? 28 : phase === "clash" ? 46 : phase === "victory" ? 8 : 0;
  const wildOffset = phase === "approach" ? -28 : phase === "clash" ? -46 : phase === "defeat" ? -8 : 0;

  return (
    <section className="card relative overflow-hidden p-5 md:p-7" aria-label="Battle arena">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(34,211,238,0.12),transparent_65%)]" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Battle arena</h2>
          <p className="text-sm font-semibold text-cyan-200" aria-live="polite">{phaseLabels[phase]}</p>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6">
          <motion.div
            animate={{ x: reducedMotion ? 0 : teamOffset }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="min-w-0"
          >
            <p className="mb-3 truncate text-center text-xs font-semibold uppercase tracking-wider text-violet-200">{teamName}</p>
            <div className="flex min-h-28 items-center justify-center gap-1 sm:gap-3">
              {team.map((monster, index) => (
                <motion.div
                  key={monster.id}
                  animate={{ y: phase === "clash" && !reducedMotion ? [0, -9, 0] : 0 }}
                  transition={{ duration: 0.32, delay: index * 0.06 }}
                  className="flex min-w-0 flex-col items-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-950/60 p-2 shadow-[0_0_24px_rgba(139,92,246,0.16)] sm:h-20 sm:w-20">
                    <Image src={monster.imageUrl} alt={monster.name} width={72} height={72} className="h-full w-full object-contain" />
                  </div>
                  <span className="mt-2 max-w-20 truncate text-center text-[11px] text-slate-300">{monster.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative flex h-12 w-12 items-center justify-center">
            <span className="text-sm font-black italic text-slate-500">VS</span>
            <motion.span
              aria-hidden="true"
              animate={phase === "clash" ? { opacity: [0, 1, 0], scale: [0.5, 1.7, 0.7] } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.45 }}
              className="absolute h-10 w-10 rounded-full bg-cyan-300/70 blur-md"
            />
          </div>

          <motion.div
            animate={{ x: reducedMotion ? 0 : wildOffset }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
            className="min-w-0"
          >
            <p className="mb-3 truncate text-center text-xs font-semibold uppercase tracking-wider text-rose-200">Wild</p>
            <div className="flex min-h-28 items-center justify-center">
              <motion.div
                animate={{ y: phase === "clash" && !reducedMotion ? [0, -9, 0] : 0 }}
                transition={{ duration: 0.32 }}
                className="flex flex-col items-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-950/50 p-2 shadow-[0_0_24px_rgba(251,113,133,0.16)] sm:h-20 sm:w-20">
                  <Image src={wildMonster.imageUrl} alt={wildMonster.name} width={72} height={72} className="h-full w-full object-contain" />
                </div>
                <span className="mt-2 max-w-24 truncate text-center text-[11px] text-slate-300">{wildMonster.name}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
