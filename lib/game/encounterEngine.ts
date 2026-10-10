import type { Monster } from "@/lib/data";

export type BattleResult = {
  winner: "player" | "wild";
  playerPower: number;
  wildPower: number;
  summary: string;
  rewardMonster?: Monster;
};

export function calculatePower(monsters: Monster[]) {
  if (!monsters.length) return 0;
  const total = monsters.reduce(
    (acc, monster) => ({
      attack: acc.attack + monster.attack,
      defense: acc.defense + monster.defense,
      speed: acc.speed + monster.speed,
    }),
    { attack: 0, defense: 0, speed: 0 },
  );

  const average = {
    attack: total.attack / monsters.length,
    defense: total.defense / monsters.length,
    speed: total.speed / monsters.length,
  };

  return average.attack * 1.7 + average.defense * 1.1 + average.speed * 1.4;
}

export function resolveEncounter(playerTeam: Monster[], wildMonster: Monster, rewardPool: Monster[] = []): BattleResult {
  const playerPower = calculatePower(playerTeam);
  const wildPower = calculatePower([wildMonster]);
  const playerWon = playerPower >= wildPower;

  let rewardMonster: Monster | undefined;
  if (playerWon) {
    rewardMonster = rewardPool.find((monster) => !playerTeam.some((owned) => owned.id === monster.id)) ?? rewardPool[0];
  }

  const summary = playerWon
    ? `${playerTeam.map((monster) => monster.name).join(", ")} defeated ${wildMonster.name} with a tactical edge of ${playerPower.toFixed(1)} to ${wildPower.toFixed(1)}.`
    : `${wildMonster.name} outplayed the squad in a hard-fought battle, with a score of ${wildPower.toFixed(1)} to ${playerPower.toFixed(1)}.`;

  return {
    winner: playerWon ? "player" : "wild",
    playerPower,
    wildPower,
    summary,
    rewardMonster,
  };
}
