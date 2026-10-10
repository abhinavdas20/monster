"use client";

import { clearAuthSession, tokenStorageKey } from "@/components/AuthProvider";

export function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const token = sessionStorage.getItem(tokenStorageKey);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(input, { ...init, headers }).then((response) => {
    if (response.status === 401) {
      clearAuthSession();
    }
    return response;
  });
}
