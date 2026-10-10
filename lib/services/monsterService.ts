import { prisma } from "@/lib/db/prisma";

export function getAllMonsters() {
  return prisma.monster.findMany({ orderBy: { name: "asc" } });
}

export function getMonsterPool() {
  return getAllMonsters();
}
