export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="card p-6 text-sm text-slate-300">
      <div className="inline-flex items-center gap-2">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />
        {message}
      </div>
    </div>
  );
}
