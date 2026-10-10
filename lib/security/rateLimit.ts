import { NextResponse } from "next/server";

type AttemptWindow = { count: number; resetsAt: number };
const windows = new Map<string, AttemptWindow>();
const maximumTrackedKeys = 10_000;

export function limitAuthRequests(request: Request, action: "login" | "register") {
  const windowMs = action === "login" ? 15 * 60_000 : 60 * 60_000;
  const limit = action === "login" ? 10 : 20;
  const sourceIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${action}:${sourceIp}`;
  const now = Date.now();
  const current = windows.get(key);
  const bucket = !current || current.resetsAt <= now
    ? { count: 0, resetsAt: now + windowMs }
    : current;

  if (bucket.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetsAt - now) / 1000));
    return NextResponse.json(
      { message: "Too many authentication attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  bucket.count += 1;
  windows.set(key, bucket);
  if (windows.size > maximumTrackedKeys) {
    for (const [trackedKey, trackedWindow] of windows) {
      if (trackedWindow.resetsAt <= now) windows.delete(trackedKey);
    }
    if (windows.size > maximumTrackedKeys) {
      const oldestKey = windows.keys().next().value;
      if (oldestKey) windows.delete(oldestKey);
    }
  }
  return null;
}
