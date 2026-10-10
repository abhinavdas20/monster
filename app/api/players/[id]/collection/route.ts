import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api/authenticate";
import { getPlayerCollection } from "@/lib/services/playerService";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(_request);
  if ("error" in auth) return auth.error;
  const { id } = await params;
  if (id !== auth.playerId) {
    return NextResponse.json({ message: "You can only view your own collection" }, { status: 403 });
  }
  const collection = await getPlayerCollection(auth.playerId);
  return NextResponse.json({ playerId: auth.playerId, collection });
}
