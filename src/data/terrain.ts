export type TerrainLevelId = 1 | 2 | 3;

export interface TerrainPlatform {
  x: number;
  y: number;
  width: number;
  height: number;
}

const SEGMENT_WIDTH = 1280;
const WORLD_SEGMENTS = 3;

/**
 * Collision surfaces traced against the foreground silhouettes in each
 * 1280×720 rendered background. The source paintings are repeated three times.
 */
const LOCAL_TERRAIN: Record<TerrainLevelId, readonly TerrainPlatform[]> = {
  1: [
    { x: 0, y: 554, width: 422, height: 166 },
    { x: 451, y: 479, width: 99, height: 241 },
    { x: 579, y: 540, width: 78, height: 180 },
    { x: 700, y: 551, width: 144, height: 169 },
    { x: 1080, y: 550, width: 145, height: 170 },
    { x: 1232, y: 536, width: 48, height: 184 },
  ],
  2: [
    { x: 0, y: 577, width: 180, height: 143 },
    { x: 264, y: 519, width: 122, height: 201 },
    { x: 387, y: 541, width: 76, height: 179 },
    { x: 482, y: 554, width: 289, height: 166 },
    { x: 847, y: 578, width: 99, height: 142 },
    { x: 1002, y: 603, width: 104, height: 117 },
    { x: 1106, y: 451, width: 162, height: 269 },
  ],
  3: [
    { x: 0, y: 580, width: 1280, height: 140 },
    { x: 122, y: 484, width: 240, height: 96 },
    { x: 543, y: 527, width: 169, height: 53 },
    { x: 1077, y: 505, width: 132, height: 75 },
  ],
};

export const getTerrainPlatforms = (levelId: TerrainLevelId): TerrainPlatform[] =>
  Array.from({ length: WORLD_SEGMENTS }, (_, segment) =>
    LOCAL_TERRAIN[levelId].map((platform) => ({
      ...platform,
      x: platform.x + segment * SEGMENT_WIDTH,
    })),
  ).flat();

export const getTerrainSurfaceAt = (
  levelId: TerrainLevelId,
  worldX: number,
): TerrainPlatform | undefined =>
  getTerrainPlatforms(levelId)
    .filter((platform) => worldX >= platform.x && worldX <= platform.x + platform.width)
    .sort((left, right) => left.y - right.y)[0];

export const getTerrainSurfaceY = (
  levelId: TerrainLevelId,
  worldX: number,
): number | undefined => getTerrainSurfaceAt(levelId, worldX)?.y;
