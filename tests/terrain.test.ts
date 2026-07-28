import { describe, expect, it } from "vitest";
import {
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
    expect(getTerrainSurfaceY(2, 210)).toBeUndefined();
  });

  it("chooses the highest visible platform when surfaces overlap", () => {
    expect(getTerrainSurfaceY(2, 1150)).toBe(451);
    expect(getTerrainSurfaceY(3, 200)).toBe(484);
  });

  it("exposes platform bounds for grounded enemy patrols", () => {
    const surface = getTerrainSurfaceAt(1, 760);
    expect(surface).toMatchObject({ x: 700, width: 144, y: 551 });
  });

  it("matches representative painted platform tops", () => {
    expect(getTerrainSurfaceY(1, 500)).toBe(479);
    expect(getTerrainSurfaceY(2, 620)).toBe(554);
    expect(getTerrainSurfaceY(2, 1020)).toBe(603);
    expect(getTerrainSurfaceY(3, 620)).toBe(527);
    expect(getTerrainSurfaceY(3, 900)).toBe(580);
  });

  it("builds three complete collision segments", () => {
    expect(getTerrainPlatforms(3)).toHaveLength(12);
  });
});
