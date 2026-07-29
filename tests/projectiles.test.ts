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

  it("keeps the elephant tusk wave horizontal", () => {
    const velocity = getProjectileVelocity(
      "tusk-wave",
      { x: 500, y: 500 },
      { x: 900, y: 120 },
    );
    expect(velocity).toEqual({ x: 430, y: 0 });
  });

  it("aims the lotus stinger at its telegraphed target", () => {
    const velocity = getProjectileVelocity(
      "lotus-stinger",
      { x: 0, y: 0 },
      { x: 3, y: 4 },
    );
    expect(Math.hypot(velocity.x, velocity.y)).toBeCloseTo(455);
  });

  it("keeps Matchanu's tidal trident horizontal", () => {
    const velocity = getProjectileVelocity(
      "tidal-trident",
      { x: 700, y: 360 },
      { x: 200, y: 510 },
    );
    expect(velocity).toEqual({ x: -445, y: 0 });
  });

  it("uses distinct speeds for the gatekeeper and Maiyarap powers", () => {
    const shield = getProjectileVelocity(
      "shield-disc",
      { x: 0, y: 0 },
      { x: 3, y: 4 },
    );
    const hypnosis = getProjectileVelocity(
      "hypnosis-orb",
      { x: 0, y: 0 },
      { x: 3, y: 4 },
    );
    expect(Math.hypot(shield.x, shield.y)).toBeCloseTo(345);
    expect(Math.hypot(hypnosis.x, hypnosis.y)).toBeCloseTo(260);
  });
});
