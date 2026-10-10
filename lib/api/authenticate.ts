import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/security/jwt";

export async function authenticateRequest(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.match(/^Bearer ([^\s]+)$/i)?.[1];
  if (!token) {
    return {
      error: NextResponse.json(
        { message: "Bearer token required" },
        { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
      ),
    };
  }

  const playerId = await verifyAccessToken(token);
  if (!playerId) {
    return {
      error: NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401, headers: { "WWW-Authenticate": "Bearer" } },
      ),
    };
  }

  return { playerId };
}
