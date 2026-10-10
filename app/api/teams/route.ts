import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/api/authenticate";
import { readJson } from "@/lib/api/request";
import { DomainError } from "@/lib/services/errors";
import { createTeam, getTeamsForPlayer } from "@/lib/services/teamService";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ teams: await getTeamsForPlayer(auth.playerId) });
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) return auth.error;

  const parsed = await readJson(request, z.object({
    name: z.string().trim().min(1).max(40),
    monsterIds: z.array(z.string().min(1).max(64)).min(1).max(3),
  }));
  if ("error" in parsed) return parsed.error;

  try {
    const team = await createTeam(auth.playerId, parsed.data.name, parsed.data.monsterIds);
    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    if (error instanceof DomainError) return NextResponse.json({ message: error.message }, { status: 400 });
    throw error;
  }
}
