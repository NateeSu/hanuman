import { describe, expect, it } from "vitest";
import { applyInvulnerability, canTakeDamage } from "../src/systems/combat";

describe("damage timing", () => {
  it("blocks repeated damage during the invulnerability window", () => {
    const state = applyInvulnerability({ invulnerableUntil: 0 }, 1000, 900);
    expect(canTakeDamage(state, 1500)).toBe(false);
    expect(canTakeDamage(state, 1900)).toBe(true);
  });
});
