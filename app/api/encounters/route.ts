import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/api/authenticate";
import { readJson } from "@/lib/api/request";
import { DomainError } from "@/lib/services/errors";
import { createEncounter, getHistoryForPlayer } from "@/lib/services/encounterService";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ history: await getHistoryForPlayer(auth.playerId) });
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) return auth.error;

  const parsed = await readJson(request, z.object({
    teamId: z.string().min(1).max(64),
    wildMonsterId: z.string().min(1).max(64),
  }));
  if ("error" in parsed) return parsed.error;

  try {
    const encounter = await createEncounter(auth.playerId, parsed.data.teamId, parsed.data.wildMonsterId);
    return NextResponse.json({ encounter }, { status: 201 });
  } catch (error) {
    if (error instanceof DomainError) return NextResponse.json({ message: error.message }, { status: 400 });
    throw error;
  }
}
