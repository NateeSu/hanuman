import { describe, expect, it } from "vitest";
import { getProjectileVelocity } from "../src/systems/projectileMotion";

describe("hostile projectile trajectories", () => {
  it("fires an arrow toward the telegraphed target at its configured speed", () => {
    const velocity = getProjectileVelocity(
      "arrow",
      { x: 100, y: 300 },
      { x: 400, y: 300 },
    );
    expect(velocity).toEqual({ x: 500, y: 0 });
  });

  it("aims magic projectiles in two dimensions", () => {
    const velocity = getProjectileVelocity(
      "mage-orb",
      { x: 0, y: 0 },
      { x: 3, y: 4 },
    );
    expect(Math.hypot(velocity.x, velocity.y)).toBeCloseTo(285);
    expect(velocity.y).toBeGreaterThan(velocity.x);
  });

  it("keeps boss shockwaves on the ground", () => {
    const velocity = getProjectileVelocity(
      "boss-wave",
      { x: 500, y: 540 },
      { x: 100, y: 300 },
    );
    expect(velocity.x).toBe(-390);
    expect(velocity.y).toBe(0);
  });
});
