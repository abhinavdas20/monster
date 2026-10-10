import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api/authenticate";
import { getEncounterById } from "@/lib/services/encounterService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(request);
  if ("error" in auth) return auth.error;
  const { id } = await params;
  const encounter = await getEncounterById(auth.playerId, id);

  if (!encounter) {
    return NextResponse.json({ message: "Encounter not found" }, { status: 404 });
  }

  return NextResponse.json({ encounter });
}
