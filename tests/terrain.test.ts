import { describe, expect, it } from "vitest";
import {
  getTerrainCollisionSegments,
  getTerrainDeathZoneAt,
  getTerrainDeathZones,
  getTerrainPlatforms,
  getTerrainSurfaceAt,
  getTerrainSurfaceY,
} from "../src/data/terrain";

describe("authored terrain collision", () => {
  it("repeats each traced background segment across the world", () => {
    const first = getTerrainSurfaceY(1, 100);
    expect(getTerrainSurfaceY(1, 100 + 1280)).toBe(first);
    expect(getTerrainSurfaceY(1, 100 + 2560)).toBe(first);
  });

  it("keeps intentional gaps non-solid", () => {
    expect(getTerrainSurfaceY(1, 560)).toBeUndefined();
    expect(getTerrainSurfaceY(1, 930)).toBeUndefined();
    expect(getTerrainSurfaceY(2, 372)).toBeUndefined();
    expect(getTerrainSurfaceY(3, 292)).toBeUndefined();
  });

  it("chooses the highest visible platform when surfaces overlap", () => {
    expect(getTerrainSurfaceY(5, 1150)).toBe(451);
    expect(getTerrainSurfaceY(7, 200)).toBe(484);
  });

  it("exposes platform bounds for grounded enemy patrols", () => {
    const surface = getTerrainSurfaceAt(1, 760);
    expect(surface).toMatchObject({ x: 700, width: 144, y: 551 });
  });

  it("matches representative painted platform tops", () => {
    expect(getTerrainSurfaceY(1, 500)).toBe(479);
    expect(getTerrainSurfaceY(2, 620)).toBeCloseTo(510.25);
    expect(getTerrainSurfaceY(3, 620)).toBe(508);
    expect(getTerrainSurfaceY(4, 200)).toBe(500);
    expect(getTerrainSurfaceY(5, 620)).toBe(554);
    expect(getTerrainSurfaceY(5, 1020)).toBe(603);
    expect(getTerrainSurfaceY(6, 900)).toBeCloseTo(581);
    expect(getTerrainSurfaceY(7, 620)).toBe(527);
    expect(getTerrainSurfaceY(7, 900)).toBeCloseTo(581);
  });

  it("builds three complete collision segments", () => {
    expect(getTerrainPlatforms(3)).toHaveLength(15);
    expect(getTerrainPlatforms(6)).toHaveLength(3);
  });

  it("interpolates painted slopes instead of returning one flat top", () => {
    expect(getTerrainSurfaceY(2, 520)).toBe(518);
    expect(getTerrainSurfaceY(2, 1040)).toBe(500);
    expect(getTerrainSurfaceY(2, 1280)).toBe(475);
  });

  it("builds narrow collision steps that trace authored slopes", () => {
    const slopeSteps = getTerrainCollisionSegments(2).filter(
      (platform) => platform.x >= 520 && platform.x < 1280,
    );
    expect(slopeSteps.length).toBeGreaterThan(25);
    expect(slopeSteps[0].y).toBeGreaterThan(slopeSteps.at(-1)!.y);
    expect(Math.max(...slopeSteps.map((step) => step.width))).toBeLessThanOrEqual(
      24,
    );
  });

  it("repeats fatal abyss zones but only activates below their lip", () => {
    expect(getTerrainDeathZones(1)).toHaveLength(3);
    expect(getTerrainDeathZoneAt(1, 930, 620)).toBeUndefined();
    expect(getTerrainDeathZoneAt(1, 930, 640)).toMatchObject({
      x: 844,
      width: 236,
    });
    expect(getTerrainDeathZoneAt(1, 930 + 1280, 640)).toMatchObject({
      x: 2124,
    });
  });
});
