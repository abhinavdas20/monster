import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/security/password";

const starterMonsterIds = ["m1", "m2", "m3"];
const starterTeamMonsterIds = ["m1", "m2"];

export async function createPlayer(username: string, password: string) {
  const passwordHash = await hashPassword(password);

  return prisma.player.create({
    data: {
      username,
      usernameNormalized: username.toLowerCase(),
      passwordHash,
      collection: {
        create: starterMonsterIds.map((monsterId) => ({
          monster: { connect: { id: monsterId } },
        })),
      },
      teams: {
        create: {
          name: "Starter Squad",
          monsters: {
            create: starterTeamMonsterIds.map((monsterId) => ({
              monster: { connect: { id: monsterId } },
            })),
          },
        },
      },
    },
    select: { id: true, username: true, createdAt: true },
  });
}

export function getPlayerByUsername(username: string) {
  return prisma.player.findUnique({ where: { usernameNormalized: username.trim().toLowerCase() } });
}

export function getPlayerCollection(playerId: string) {
  return prisma.playerMonster.findMany({
    where: { playerId },
    include: { monster: true },
    orderBy: { obtainedAt: "asc" },
  }).then((entries) => entries.map(({ monster }) => monster));
}
