import { describe, expect, it } from "vitest";
import {
  NORMAL_ATTACK_PROFILE,
  createNormalAttack,
} from "../src/systems/playerAttack";

describe("normal attack volume", () => {
  it("extends a short distance in front of Hanuman", () => {
    const attack = createNormalAttack(500, 560, 1);

    expect(attack.left).toBe(515);
    expect(attack.left + attack.width).toBe(735);
    expect(attack.top).toBe(415);
    expect(attack.top + attack.height).toBe(595);
  });

  it("mirrors the damage volume when facing left", () => {
    const attack = createNormalAttack(500, 560, -1);

    expect(attack.left).toBe(265);
    expect(attack.left + attack.width).toBe(485);
  });

  it("keeps normal damage and VFX timing in one profile", () => {
    const attack = createNormalAttack(500, 560, 1);

    expect(attack.damage).toBe(28);
    expect(attack.durationMs).toBe(NORMAL_ATTACK_PROFILE.durationMs);
    expect(attack.isSkill).toBe(false);
  });
});
