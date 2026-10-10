import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const baseUrl = (process.env.API_URL ?? "http://localhost:3000").replace(/\/$/, "");
const prisma = new PrismaClient();
const username = `api-check-${randomUUID().slice(0, 12)}`;
const password = "api-smoke-password-2026";
const playerIds = [];

async function call(path, { token, ...init } = {}) {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });
  const payload = await response.json();
  return { response, payload };
}

async function register(name) {
  const { response, payload } = await call("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username: name, password }),
  });
  assert.equal(response.status, 201, `registration failed: ${JSON.stringify(payload)}`);
  playerIds.push(payload.player.id);
  return payload;
}

try {
  const roster = await call("/api/monsters");
  assert.equal(roster.response.status, 200);
  assert.ok(roster.payload.monsters.length >= 4, "seeded monster roster is available");

  const unauthorized = await call("/api/teams");
  assert.equal(unauthorized.response.status, 401, "private endpoints require a token");

  const first = await register(username);
  const auth = { token: first.token };
  const collection = await call(`/api/players/${first.player.id}/collection`, auth);
  assert.equal(collection.response.status, 200);
  assert.ok(collection.payload.collection.length >= 2, "registration grants starter monsters");

  const teamList = await call("/api/teams", auth);
  assert.equal(teamList.response.status, 200);
  assert.ok(teamList.payload.teams.length >= 1, "registration creates a starter team");

  const team = await call("/api/teams", {
    ...auth,
    method: "POST",
    body: JSON.stringify({ name: "API Smoke Squad", monsterIds: ["m1", "m2"] }),
  });
  assert.equal(team.response.status, 201, `team creation failed: ${JSON.stringify(team.payload)}`);

  const badTeam = await call("/api/teams", {
    ...auth,
    method: "POST",
    body: JSON.stringify({ name: "Bad Squad", monsterIds: ["m1", "m2", "m3", "m4"] }),
  });
  assert.equal(badTeam.response.status, 400, "team size validation is enforced");

  const encounter = await call("/api/encounters", {
    ...auth,
    method: "POST",
    body: JSON.stringify({ teamId: team.payload.team.id, wildMonsterId: "m4" }),
  });
  assert.equal(encounter.response.status, 201, `encounter failed: ${JSON.stringify(encounter.payload)}`);

  const history = await call("/api/history", auth);
  assert.equal(history.response.status, 200);
  assert.ok(history.payload.history.some((entry) => entry.id === encounter.payload.encounter.id), "history persists the encounter");

  const encounterDetail = await call(`/api/encounters/${encounter.payload.encounter.id}`, auth);
  assert.equal(encounterDetail.response.status, 200);

  const second = await register(`${username}-other`);
  const foreignCollection = await call(`/api/players/${first.player.id}/collection`, { token: second.token });
  assert.equal(foreignCollection.response.status, 403, "players cannot read another collection");
  const isolatedHistory = await call("/api/history", { token: second.token });
  assert.equal(isolatedHistory.response.status, 200);
  assert.equal(isolatedHistory.payload.history.length, 0, "history is player-scoped");

  console.log("API smoke passed: auth, validation, ownership, team creation, encounters, and persistent history.");
} catch (error) {
  console.error("API smoke failed:", error);
  process.exitCode = 1;
} finally {
  if (playerIds.length) {
    try {
      const createdTeams = await prisma.team.findMany({
        where: { playerId: { in: playerIds } },
        select: { id: true },
      });
      const teamIds = createdTeams.map(({ id }) => id);
      await prisma.$transaction([
        prisma.encounter.deleteMany({ where: { playerId: { in: playerIds } } }),
        prisma.teamMonster.deleteMany({ where: { teamId: { in: teamIds } } }),
        prisma.team.deleteMany({ where: { playerId: { in: playerIds } } }),
        prisma.playerMonster.deleteMany({ where: { playerId: { in: playerIds } } }),
        prisma.player.deleteMany({ where: { id: { in: playerIds } } }),
      ]);
    } catch (error) {
      console.error("Unable to clean up API smoke accounts:", error);
      process.exitCode = 1;
    }
  }
  await prisma.$disconnect();
}
