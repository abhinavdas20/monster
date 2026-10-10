import { calculatePower, resolveEncounter } from "@/lib/game/encounterEngine";
import { MONSTERS } from "@/lib/data";

describe("encounter engine", () => {
  it("chooses the player as the victor when the squad power is higher", () => {
    const team = [MONSTERS[0], MONSTERS[1]];
    const wild = MONSTERS[5];

    const result = resolveEncounter(team, wild, MONSTERS);

    expect(result.winner).toBe("player");
    expect(result.playerPower).toBeGreaterThan(result.wildPower);
  });

  it("calculates aggregate team power from attack, defense, and speed", () => {
    const teamPower = calculatePower([MONSTERS[0], MONSTERS[1]]);
    expect(teamPower).toBeGreaterThan(0);
  });
});
