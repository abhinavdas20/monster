export function ResultPanel({ outcome, summary, rewardMonster }: { outcome: string; summary: string; rewardMonster?: { name: string } | null }) {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-bold text-white">Battle result</h3>
      <p className="mt-3 text-lg font-semibold text-cyan-300">{outcome}</p>
      <p className="mt-2 text-sm text-slate-300">{summary}</p>
      {rewardMonster ? (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
          Reward earned: <strong>{rewardMonster.name}</strong>
        </div>
      ) : null}
    </div>
  );
}
