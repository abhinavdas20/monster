/** @jest-environment node */

import { POST as createEncounter } from "@/app/api/encounters/route";
import { GET as getTeams, POST as createTeam } from "@/app/api/teams/route";
import { createAccessToken } from "@/lib/security/jwt";
import { limitAuthRequests } from "@/lib/security/rateLimit";

function requireResponse(response: Response | undefined) {
  if (!response) throw new Error("Route did not return a response");
  return response;
}

describe("protected API routes", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it("rejects requests without a bearer token", async () => {
    const response = requireResponse(await getTeams(new Request("http://localhost/api/teams")));

    expect(response.status).toBe(401);
    expect(response.headers.get("WWW-Authenticate")).toBe("Bearer");
  });

  it("rejects malformed and expired-looking bearer tokens", async () => {
    const response = requireResponse(await getTeams(new Request("http://localhost/api/teams", {
      headers: { Authorization: "Bearer invalid-token" },
    })));

    expect(response.status).toBe(401);
  });

  it("validates team payloads before touching player data", async () => {
    const token = await createAccessToken("player-test");
    const response = requireResponse(await createTeam(new Request("http://localhost/api/teams", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Empty team", monsterIds: [] }),
    })));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ message: "Request validation failed" });
  });

  it("returns a client error for invalid JSON", async () => {
    const token = await createAccessToken("player-test");
    const response = requireResponse(await createEncounter(new Request("http://localhost/api/encounters", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: "{",
    })));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ message: "Request body must be valid JSON" });
  });

  it("throttles repeated login attempts", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.42" },
    });

    for (let attempt = 0; attempt < 10; attempt += 1) {
      expect(limitAuthRequests(request, "login")).toBeNull();
    }
    const response = limitAuthRequests(request, "login");
    expect(response?.status).toBe(429);
    expect(response?.headers.get("Retry-After")).toBeTruthy();
  });
});
