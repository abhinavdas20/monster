import { NextResponse } from "next/server";
import { z } from "zod";
import { readJson } from "@/lib/api/request";
import { limitAuthRequests } from "@/lib/security/rateLimit";
import { assertJwtSecretConfigured, createAccessToken } from "@/lib/security/jwt";
import { verifyPassword } from "@/lib/security/password";
import { getPlayerByUsername } from "@/lib/services/playerService";

const credentialsSchema = z.object({
  username: z.string().trim().min(1).max(32),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  const limited = limitAuthRequests(request, "login");
  if (limited) return limited;

  const parsed = await readJson(request, credentialsSchema);
  if ("error" in parsed) return parsed.error;
  assertJwtSecretConfigured();

  const player = await getPlayerByUsername(parsed.data.username);
  if (!player || !(await verifyPassword(parsed.data.password, player.passwordHash))) {
    return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
  }

  const token = await createAccessToken(player.id);
  return NextResponse.json({
    player: { id: player.id, username: player.username, createdAt: player.createdAt },
    token,
    tokenType: "Bearer",
    expiresIn: 3600,
  });
}
