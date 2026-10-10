/** @jest-environment node */

import { createAccessToken, verifyAccessToken } from "@/lib/security/jwt";
import { hashPassword, verifyPassword } from "@/lib/security/password";

describe("password security", () => {
  it("hashes with a random salt and verifies only the correct password", async () => {
    const first = await hashPassword("correct horse battery staple");
    const second = await hashPassword("correct horse battery staple");

    expect(first).not.toBe(second);
    await expect(verifyPassword("correct horse battery staple", first)).resolves.toBe(true);
    await expect(verifyPassword("incorrect password", first)).resolves.toBe(false);
  });

  it("rejects malformed password hashes", async () => {
    await expect(verifyPassword("password", "not-a-hash")).resolves.toBe(false);
  });
});

describe("JWT authentication", () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
  });

  afterAll(() => {
    if (originalSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = originalSecret;
  });

  it("signs a short-lived token and verifies its player subject", async () => {
    const token = await createAccessToken("player-test");
    await expect(verifyAccessToken(token)).resolves.toBe("player-test");
    await expect(verifyAccessToken(`${token}tampered`)).resolves.toBeNull();
  });

  it("requires a configured secret", async () => {
    delete process.env.JWT_SECRET;
    await expect(createAccessToken("player-test")).rejects.toThrow("JWT_SECRET must be configured");
    process.env.JWT_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
  });
});
