import { prisma } from "@/lib/db/prisma";
import { DomainError } from "@/lib/services/errors";

function toTeam(team: { id: string; playerId: string; name: string; monsters: { monsterId: string }[] }) {
  return {
    id: team.id,
    playerId: team.playerId,
    name: team.name,
    monsterIds: team.monsters.map(({ monsterId }) => monsterId),
  };
}

export async function getTeamsForPlayer(playerId: string) {
  const teams = await prisma.team.findMany({
    where: { playerId },
    include: { monsters: { orderBy: { monsterId: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  return teams.map(toTeam);
}

export async function createTeam(playerId: string, name: string, monsterIds: string[]) {
  const cleanedName = name.trim();
  const selectedMonsters = [...new Set(monsterIds)];

  if (!cleanedName) throw new DomainError("Team name is required");
  if (selectedMonsters.length !== monsterIds.length) throw new DomainError("A monster can only appear once in a team");
  if (selectedMonsters.length < 1 || selectedMonsters.length > 3) {
    throw new DomainError("A team must contain between one and three monsters");
  }

  const owned = await prisma.playerMonster.findMany({
    where: { playerId, monsterId: { in: selectedMonsters } },
    select: { monsterId: true },
  });
  if (owned.length !== selectedMonsters.length) {
    throw new DomainError("Teams can only contain monsters in your collection");
  }

  const team = await prisma.team.create({
    data: {
      playerId,
      name: cleanedName,
      monsters: { create: selectedMonsters.map((monsterId) => ({ monsterId })) },
    },
    include: { monsters: { orderBy: { monsterId: "asc" } } },
  });

  return toTeam(team);
}
