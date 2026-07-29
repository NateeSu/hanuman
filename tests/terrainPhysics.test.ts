import { describe, expect, it } from "vitest";
import { resolveTerrainLanding } from "../src/systems/terrainPhysics";

describe("terrain landing resolution", () => {
  it("sticks to a gentle uphill profile", () => {
    expect(
      resolveTerrainLanding({
        previousBottom: 504,
        currentBottom: 505,
        velocityY: 18,
        surfaceYs: [500],
      }),
    ).toBe(500);
  });

  it("lands on the first painted surface crossed while falling", () => {
    expect(
      resolveTerrainLanding({
        previousBottom: 510,
        currentBottom: 529,
        velocityY: 720,
        surfaceYs: [527, 580],
      }),
    ).toBe(527);
  });

  it("does not pull an ascending actor onto a platform", () => {
    expect(
      resolveTerrainLanding({
        previousBottom: 540,
        currentBottom: 525,
        velocityY: -500,
        surfaceYs: [527],
      }),
    ).toBeUndefined();
  });

  it("ignores an elevated platform after the actor has fallen beneath it", () => {
    expect(
      resolveTerrainLanding({
        previousBottom: 550,
        currentBottom: 568,
        velocityY: 620,
        surfaceYs: [484, 580],
      }),
    ).toBe(580);
  });
});
