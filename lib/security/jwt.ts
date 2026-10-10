import { Buffer } from "node:buffer";
import jwt from "jsonwebtoken";

const issuer = "monster-tamers";
const audience = "monster-tamers-api";

function getJwtKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
  }
  return Buffer.from(secret);
}

export function assertJwtSecretConfigured() {
  getJwtKey();
}

export async function createAccessToken(playerId: string) {
  return jwt.sign({}, getJwtKey(), {
    algorithm: "HS256",
    subject: playerId,
    issuer,
    audience,
    expiresIn: "1h",
  });
}

export async function verifyAccessToken(token: string) {
  const key = getJwtKey();
  try {
    const payload = jwt.verify(token, key, { issuer, audience, algorithms: ["HS256"] });
    return typeof payload !== "string" && typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
