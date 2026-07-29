import type { LevelId } from "./types";

export type TerrainLevelId = LevelId;

export interface TerrainPlatform {
  x: number;
  y: number;
  width: number;
  height: number;
  /**
   * Optional painted top profile. Offsets are relative to `x`; values between
   * points are interpolated so actors follow visible slopes instead of an
   * invisible flat rectangle.
   */
  surface?: readonly TerrainSurfacePoint[];
}

export interface TerrainSurfacePoint {
  offset: number;
  y: number;
}

export interface TerrainDeathZone {
  x: number;
  y: number;
  width: number;
}

const SEGMENT_WIDTH = 1280;
const WORLD_SEGMENTS = 3;
const WORLD_HEIGHT = 720;
const COLLISION_STEP_WIDTH = 24;

/**
 * Collision surfaces traced against the foreground silhouettes in each
 * 1280×720 rendered background. The source paintings are repeated three times.
 */
const LOCAL_TERRAIN: Record<TerrainLevelId, readonly TerrainPlatform[]> = {
  1: [
    {
      x: 0,
      y: 554,
      width: 422,
      height: 166,
      surface: [
        { offset: 0, y: 554 },
        { offset: 72, y: 552 },
        { offset: 148, y: 548 },
        { offset: 226, y: 546 },
        { offset: 302, y: 549 },
        { offset: 370, y: 551 },
        { offset: 422, y: 554 },
      ],
    },
    { x: 451, y: 479, width: 99, height: 241 },
    { x: 579, y: 540, width: 78, height: 180 },
    { x: 700, y: 551, width: 144, height: 169 },
    { x: 1080, y: 550, width: 145, height: 170 },
    { x: 1232, y: 536, width: 48, height: 184 },
  ],
  2: [
    {
      x: 0,
      y: 474,
      width: 342,
      height: 246,
      surface: [
        { offset: 0, y: 475 },
        { offset: 96, y: 474 },
        { offset: 204, y: 473 },
        { offset: 342, y: 475 },
      ],
    },
    { x: 406, y: 518, width: 92, height: 202 },
    {
      x: 520,
      y: 502,
      width: 760,
      height: 218,
      surface: [
        { offset: 0, y: 518 },
        { offset: 72, y: 512 },
        { offset: 152, y: 507 },
        { offset: 252, y: 504 },
        { offset: 382, y: 502 },
        { offset: 520, y: 500 },
        { offset: 640, y: 503 },
        { offset: 760, y: 502 },
      ],
    },
  ],
  3: [
    { x: 0, y: 477, width: 268, height: 243 },
    { x: 318, y: 534, width: 116, height: 186 },
    { x: 452, y: 508, width: 294, height: 212 },
    { x: 790, y: 548, width: 176, height: 172 },
    { x: 1006, y: 516, width: 274, height: 204 },
  ],
  4: [
    { x: 0, y: 556, width: 128, height: 164 },
    { x: 142, y: 500, width: 246, height: 220 },
    { x: 412, y: 578, width: 108, height: 142 },
    { x: 548, y: 614, width: 160, height: 106 },
    { x: 736, y: 609, width: 166, height: 111 },
    { x: 938, y: 554, width: 110, height: 166 },
    { x: 1062, y: 506, width: 218, height: 214 },
  ],
  5: [
    { x: 0, y: 577, width: 180, height: 143 },
    { x: 264, y: 519, width: 122, height: 201 },
    { x: 387, y: 541, width: 76, height: 179 },
    { x: 482, y: 554, width: 289, height: 166 },
    { x: 847, y: 578, width: 99, height: 142 },
    { x: 1002, y: 603, width: 104, height: 117 },
    { x: 1106, y: 451, width: 162, height: 269 },
  ],
  6: [
    {
      x: 0,
      y: 581,
      width: 1280,
      height: 139,
      surface: [
        { offset: 0, y: 582 },
        { offset: 160, y: 581 },
        { offset: 340, y: 582 },
        { offset: 520, y: 580 },
        { offset: 700, y: 582 },
        { offset: 900, y: 581 },
        { offset: 1080, y: 580 },
        { offset: 1280, y: 582 },
      ],
    },
  ],
  7: [
    {
      x: 0,
      y: 580,
      width: 1280,
      height: 140,
      surface: [
        { offset: 0, y: 581 },
        { offset: 180, y: 580 },
        { offset: 360, y: 583 },
        { offset: 540, y: 580 },
        { offset: 720, y: 582 },
        { offset: 900, y: 581 },
        { offset: 1080, y: 580 },
        { offset: 1280, y: 581 },
      ],
    },
    { x: 122, y: 484, width: 240, height: 96 },
    { x: 543, y: 527, width: 169, height: 53 },
    { x: 1077, y: 505, width: 132, height: 75 },
  ],
};

const LOCAL_DEATH_ZONES: Record<
  TerrainLevelId,
  readonly TerrainDeathZone[]
> = {
  1: [{ x: 844, y: 632, width: 236 }],
  2: [{ x: 342, y: 610, width: 64 }],
  3: [
    { x: 268, y: 620, width: 50 },
    { x: 746, y: 628, width: 44 },
    { x: 966, y: 630, width: 40 },
  ],
  4: [
    { x: 388, y: 668, width: 24 },
    { x: 520, y: 674, width: 28 },
    { x: 708, y: 676, width: 28 },
    { x: 902, y: 668, width: 36 },
  ],
  5: [
    { x: 180, y: 650, width: 84 },
    { x: 771, y: 652, width: 76 },
    { x: 946, y: 668, width: 56 },
  ],
  6: [],
  7: [],
};

const surfaceYOnPlatform = (
  platform: TerrainPlatform,
  worldX: number,
): number => {
  const points = platform.surface;
  if (!points || points.length < 2) return platform.y;
  const offset = PhaserClamp(worldX - platform.x, 0, platform.width);
  const rightIndex = points.findIndex((point) => point.offset >= offset);
  if (rightIndex <= 0) return points[0].y;
  const left = points[rightIndex - 1];
  const right = points[rightIndex];
  const span = Math.max(1, right.offset - left.offset);
  const progress = (offset - left.offset) / span;
  return left.y + (right.y - left.y) * progress;
};

const PhaserClamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const getTerrainPlatforms = (levelId: TerrainLevelId): TerrainPlatform[] =>
  Array.from({ length: WORLD_SEGMENTS }, (_, segment) =>
    LOCAL_TERRAIN[levelId].map((platform) => ({
      ...platform,
      x: platform.x + segment * SEGMENT_WIDTH,
    })),
  ).flat();

export const getTerrainSurfaceYs = (
  levelId: TerrainLevelId,
  worldX: number,
): number[] =>
  getTerrainPlatforms(levelId)
    .filter(
      (platform) =>
        worldX >= platform.x && worldX <= platform.x + platform.width,
    )
    .map((platform) => surfaceYOnPlatform(platform, worldX))
    .sort((left, right) => left - right);

export const getTerrainSurfaceAt = (
  levelId: TerrainLevelId,
  worldX: number,
): TerrainPlatform | undefined =>
  getTerrainPlatforms(levelId)
    .filter((platform) => worldX >= platform.x && worldX <= platform.x + platform.width)
    .sort(
      (left, right) =>
        surfaceYOnPlatform(left, worldX) - surfaceYOnPlatform(right, worldX),
    )[0];

export const getTerrainSurfaceY = (
  levelId: TerrainLevelId,
  worldX: number,
): number | undefined => getTerrainSurfaceYs(levelId, worldX)[0];

export const getTerrainCollisionSegments = (
  levelId: TerrainLevelId,
): TerrainPlatform[] =>
  getTerrainPlatforms(levelId).flatMap((platform) => {
    const count = Math.max(
      1,
      Math.ceil(platform.width / COLLISION_STEP_WIDTH),
    );
    return Array.from({ length: count }, (_, index) => {
      const x = platform.x + index * COLLISION_STEP_WIDTH;
      const width = Math.min(
        COLLISION_STEP_WIDTH,
        platform.x + platform.width - x,
      );
      const y = surfaceYOnPlatform(platform, x + width / 2);
      return { x, y, width, height: WORLD_HEIGHT - y };
    });
  });

export const getTerrainDeathZones = (
  levelId: TerrainLevelId,
): TerrainDeathZone[] =>
  Array.from({ length: WORLD_SEGMENTS }, (_, segment) =>
    LOCAL_DEATH_ZONES[levelId].map((zone) => ({
      ...zone,
      x: zone.x + segment * SEGMENT_WIDTH,
    })),
  ).flat();

export const getTerrainDeathZoneAt = (
  levelId: TerrainLevelId,
  worldX: number,
  actorBottom: number,
): TerrainDeathZone | undefined =>
  getTerrainDeathZones(levelId).find(
    (zone) =>
      worldX >= zone.x &&
      worldX <= zone.x + zone.width &&
      actorBottom >= zone.y,
  );
