const UPHILL_SNAP_PX = 8;
const LANDING_LOOKAHEAD_PX = 18;

export interface TerrainLandingInput {
  previousBottom: number;
  currentBottom: number;
  velocityY: number;
  surfaceYs: readonly number[];
}

/**
 * Chooses the first painted surface crossed by a descending actor. A small
 * uphill allowance keeps feet glued to gentle rock slopes without pulling a
 * jumping actor through a platform from below.
 */
export const resolveTerrainLanding = ({
  previousBottom,
  currentBottom,
  velocityY,
  surfaceYs,
}: TerrainLandingInput): number | undefined => {
  if (velocityY < 0) return undefined;

  return surfaceYs.find(
    (surfaceY) =>
      previousBottom <= surfaceY + UPHILL_SNAP_PX &&
      currentBottom >= surfaceY - LANDING_LOOKAHEAD_PX,
  );
};
