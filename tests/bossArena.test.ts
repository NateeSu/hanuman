import { describe, expect, it } from "vitest";
import { BOSS_ARENA, resolveRespawnX } from "../src/systems/bossArena";

describe("boss arena", () => {
  it("uses the full logical viewport width", () => {
    expect(BOSS_ARENA.width).toBe(1280);
    expect(BOSS_ARENA.left + BOSS_ARENA.width).toBe(3840);
  });

  it("respawns the player inside an active boss encounter", () => {
    expect(resolveRespawnX(2470, true, false)).toBe(BOSS_ARENA.respawnX);
    expect(BOSS_ARENA.respawnX).toBeGreaterThan(BOSS_ARENA.left);
    expect(BOSS_ARENA.respawnX).toBeLessThan(
      BOSS_ARENA.left + BOSS_ARENA.width,
    );
  });

  it("keeps checkpoint respawns outside an active boss encounter", () => {
    expect(resolveRespawnX(2470, false, false)).toBe(2470);
    expect(resolveRespawnX(2470, true, true)).toBe(2470);
  });
});
