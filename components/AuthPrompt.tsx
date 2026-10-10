import Link from "next/link";

export function AuthPrompt() {
  return (
    <div className="card p-6">
      <h1 className="text-2xl font-bold text-white">Log in to continue</h1>
      <p className="mt-2 text-sm text-slate-300">Your collection, teams, battles, and history are saved to your account.</p>
      <Link href="/login" className="mt-5 inline-flex rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400">
        Log in or create an account
      </Link>
    </div>
  );
}
