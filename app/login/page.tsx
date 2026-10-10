"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type AuthResponse = {
  token?: string;
  message?: string;
  player?: { id: string; username: string; createdAt: string };
};

export default function LoginPage() {
  const router = useRouter();
  const { player, setCredentials } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(isRegistering ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const payload = (await response.json()) as AuthResponse;
      if (!response.ok || !payload.token || !payload.player) {
        setError(payload.message ?? "Unable to authenticate.");
        return;
      }
      setCredentials(payload.token, payload.player);
      router.push("/collection");
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (player) {
    return (
      <div className="card mx-auto max-w-lg p-6">
        <h1 className="text-2xl font-bold text-white">You are logged in</h1>
        <p className="mt-2 text-slate-300">Signed in as {player.username}.</p>
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-lg p-6 md:p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Trainer account</p>
      <h1 className="mt-2 text-3xl font-black text-white">{isRegistering ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-2 text-sm text-slate-300">
        {isRegistering ? "New trainers start with a collection and a starter team." : "Log in to continue your adventure."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm text-slate-300">
          Username
          <input
            required
            minLength={isRegistering ? 3 : 1}
            maxLength={32}
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input
            required
            minLength={isRegistering ? 8 : 1}
            maxLength={128}
            type="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
          />
        </label>
        {error ? <p role="alert" className="text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Please wait..." : isRegistering ? "Create account" : "Log in"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => { setIsRegistering((current) => !current); setError(null); }}
        className="mt-4 text-sm text-violet-300 hover:text-violet-200"
      >
        {isRegistering ? "Already have an account? Log in" : "New here? Create an account"}
      </button>
    </div>
  );
}
