import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { resolveEncounter } from "@/lib/game/encounterEngine";
import { DomainError } from "@/lib/services/errors";

export async function getEncounterById(playerId: string, encounterId: string) {
  return prisma.encounter.findFirst({
    where: { id: encounterId, playerId },
    include: { wildMonster: true, rewardMonster: true },
  });
}

export async function getHistoryForPlayer(playerId: string) {
  return prisma.encounter.findMany({
    where: { playerId },
    include: { wildMonster: true, rewardMonster: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createEncounter(playerId: string, teamId: string, wildMonsterId: string) {
  return prisma.$transaction(async (tx) => {
    const team = await tx.team.findFirst({
      where: { id: teamId, playerId },
      include: { monsters: { include: { monster: true } } },
    });
    if (!team) throw new DomainError("Team not found");
    if (team.monsters.length === 0) throw new DomainError("Your team has no monsters");

    const wildMonster = await tx.monster.findUnique({ where: { id: wildMonsterId } });
    if (!wildMonster) throw new DomainError("Wild monster not found");

    const owned = await tx.playerMonster.findMany({
      where: { playerId },
      select: { monsterId: true },
    });
    const ownedIds = new Set(owned.map(({ monsterId }) => monsterId));
    const rewardPool = await tx.monster.findMany({
      where: { id: { notIn: [...ownedIds] } },
    });
    const result = resolveEncounter(
      team.monsters.map(({ monster }) => monster),
      wildMonster,
      rewardPool,
    );

    if (result.rewardMonster) {
      await tx.playerMonster.create({
        data: { playerId, monsterId: result.rewardMonster.id },
      });
    }

    return tx.encounter.create({
      data: {
        playerId,
        teamId,
        wildMonsterId,
        outcome: result.winner === "player" ? "win" : "loss",
        playerPower: Number(result.playerPower.toFixed(1)),
        wildPower: Number(result.wildPower.toFixed(1)),
        summary: result.summary,
        rewardMonsterId: result.rewardMonster?.id,
      },
      include: { wildMonster: true, rewardMonster: true },
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
