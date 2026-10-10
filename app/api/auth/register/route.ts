import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { readJson } from "@/lib/api/request";
import { assertJwtSecretConfigured, createAccessToken } from "@/lib/security/jwt";
import { limitAuthRequests } from "@/lib/security/rateLimit";
import { createPlayer } from "@/lib/services/playerService";

const credentialsSchema = z.object({
  username: z.string().trim().min(3).max(32).regex(/^[\p{L}\p{N}_ -]+$/u),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const limited = limitAuthRequests(request, "register");
  if (limited) return limited;

  const parsed = await readJson(request, credentialsSchema);
  if ("error" in parsed) return parsed.error;
  assertJwtSecretConfigured();

  try {
    const player = await createPlayer(parsed.data.username, parsed.data.password);
    const token = await createAccessToken(player.id);
    return NextResponse.json({ player, token, tokenType: "Bearer", expiresIn: 3600 }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "That username is already registered" }, { status: 409 });
    }
    throw error;
  }
}
