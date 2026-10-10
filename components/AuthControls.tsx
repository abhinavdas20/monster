"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export function AuthControls() {
  const { player, logout } = useAuth();
  if (!player) {
    return (
      <Link href="/login" className="rounded-full border border-cyan-500/50 px-3 py-1.5 text-cyan-200 transition hover:border-cyan-300 hover:text-white">
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="max-w-28 truncate text-xs text-slate-400">{player.username}</span>
      <button type="button" onClick={logout} className="rounded-full border border-slate-700 px-3 py-1.5 transition hover:border-rose-400 hover:text-white">
        Log out
      </button>
    </div>
  );
}
