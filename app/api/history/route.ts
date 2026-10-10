import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api/authenticate";
import { getHistoryForPlayer } from "@/lib/services/encounterService";

export async function GET(request: Request) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) return auth.error;
  return NextResponse.json({ history: await getHistoryForPlayer(auth.playerId) });
}
