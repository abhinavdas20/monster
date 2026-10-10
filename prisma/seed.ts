import { PrismaClient } from "@prisma/client";
import { MONSTERS } from "../lib/data.ts";

const prisma = new PrismaClient();

async function main() {
  for (const monster of MONSTERS) {
    await prisma.monster.upsert({
      where: { id: monster.id },
      update: monster,
      create: monster,
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error("Unable to seed monsters:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
