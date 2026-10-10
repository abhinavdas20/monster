"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

export type AuthPlayer = { id: string; username: string; createdAt: string };
type AuthContextValue = {
  token: string | null;
  player: AuthPlayer | null;
  setCredentials: (token: string, player: AuthPlayer) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const tokenStorageKey = "monster-tamers-token";
const playerStorageKey = "monster-tamers-player";
type Session = { token: string; player: AuthPlayer };
let session: Session | null = null;
let storageRead = false;
const subscribers = new Set<() => void>();

function isAuthPlayer(value: unknown): value is AuthPlayer {
  return typeof value === "object"
    && value !== null
    && "id" in value
    && typeof value.id === "string"
    && "username" in value
    && typeof value.username === "string"
    && "createdAt" in value
    && typeof value.createdAt === "string";
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(tokenStorageKey);
    sessionStorage.removeItem(playerStorageKey);
  }
  storageRead = true;
  session = null;
  notifySubscribers();
}

function readSession() {
  if (typeof window === "undefined") return null;
  if (!storageRead) {
    storageRead = true;
    const token = sessionStorage.getItem(tokenStorageKey);
    const savedPlayer = sessionStorage.getItem(playerStorageKey);
    if (token && savedPlayer) {
      try {
        const player: unknown = JSON.parse(savedPlayer);
        if (isAuthPlayer(player)) session = { token, player };
        else clearAuthSession();
      } catch {
        clearAuthSession();
      }
    }
  }
  return session;
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function notifySubscribers() {
  for (const callback of subscribers) callback();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const currentSession = useSyncExternalStore(subscribe, readSession, () => null);

  const setCredentials = (nextToken: string, nextPlayer: AuthPlayer) => {
    sessionStorage.setItem(tokenStorageKey, nextToken);
    sessionStorage.setItem(playerStorageKey, JSON.stringify(nextPlayer));
    storageRead = true;
    session = { token: nextToken, player: nextPlayer };
    notifySubscribers();
  };

  const logout = () => {
    clearAuthSession();
  };

  return (
    <AuthContext.Provider value={{ token: currentSession?.token ?? null, player: currentSession?.player ?? null, setCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used within AuthProvider");
  return auth;
}

export { tokenStorageKey };
