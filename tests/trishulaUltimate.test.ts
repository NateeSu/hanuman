import { describe, expect, it } from "vitest";
import {
  TRISHULA_ORBIT_MS,
  TRISHULA_TOTAL_MS,
  getTrishulaPosition,
} from "../src/systems/trishulaUltimate";

describe("trishula ultimate trajectory", () => {
  const cast = { x: 100, y: 300, direction: 1 as const };

  it("sweeps a broad circular path before the homing return", () => {
    const halfway = getTrishulaPosition((TRISHULA_ORBIT_MS * 2) / 3, cast, cast);
    const orbitEnd = getTrishulaPosition(TRISHULA_ORBIT_MS, cast, cast);

    expect(halfway.x).toBeGreaterThan(900);
    expect(orbitEnd.x).toBeGreaterThan(cast.x);
    expect(orbitEnd.y).toBeGreaterThan(cast.y);
    expect(orbitEnd.phase).toBe("orbit");
  });

  it("homes to Hanuman's current position after the sweep", () => {
    const movedPlayer = { x: 460, y: 540 };
    const returned = getTrishulaPosition(TRISHULA_TOTAL_MS, cast, movedPlayer);

    expect(returned.phase).toBe("complete");
    expect(returned.x).toBe(movedPlayer.x + 26);
    expect(returned.y).toBeCloseTo(movedPlayer.y - 76);
  });

  it("mirrors the orbit when Hanuman faces left", () => {
    const left = getTrishulaPosition(
      TRISHULA_ORBIT_MS / 2,
      { ...cast, direction: -1 },
      cast,
    );

    expect(left.x).toBeLessThan(cast.x);
  });
});
