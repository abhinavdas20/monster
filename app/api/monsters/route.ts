import { NextResponse } from "next/server";
import { getAllMonsters } from "@/lib/services/monsterService";

export async function GET() {
  return NextResponse.json({ monsters: await getAllMonsters() });
}
