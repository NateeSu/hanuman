export interface TrishulaPoint {
  x: number;
  y: number;
}

export interface TrishulaCastOrigin extends TrishulaPoint {
  direction: -1 | 1;
}

export type TrishulaPhase = "orbit" | "return" | "complete";

export interface TrishulaPosition extends TrishulaPoint {
  phase: TrishulaPhase;
  progress: number;
}

export const TRISHULA_WIND_COST = 35;
export const TRISHULA_ORBIT_MS = 1050;
export const TRISHULA_RETURN_MS = 420;
export const TRISHULA_TOTAL_MS = TRISHULA_ORBIT_MS + TRISHULA_RETURN_MS;
export const TRISHULA_RADIUS_X = 420;
export const TRISHULA_RADIUS_Y = 150;
const ORBIT_SWEEP_RADIANS = Math.PI * 1.5;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

/**
 * A broad elliptical sweep bends into a homing return toward Hanuman's
 * current position, so the weapon still finds him if he has moved.
 */
export const getTrishulaPosition = (
  elapsedMs: number,
  cast: TrishulaCastOrigin,
  player: TrishulaPoint,
): TrishulaPosition => {
  if (elapsedMs <= TRISHULA_ORBIT_MS) {
    const progress = clamp01(elapsedMs / TRISHULA_ORBIT_MS);
    const radians = progress * ORBIT_SWEEP_RADIANS;
    return {
      x: cast.x + cast.direction * TRISHULA_RADIUS_X * (1 - Math.cos(radians)),
      y: cast.y - Math.sin(radians) * TRISHULA_RADIUS_Y,
      phase: "orbit",
      progress,
    };
  }

  const progress = clamp01((elapsedMs - TRISHULA_ORBIT_MS) / TRISHULA_RETURN_MS);
  const eased = 1 - (1 - progress) ** 3;
  const orbitEndX =
    cast.x + cast.direction * TRISHULA_RADIUS_X * (1 - Math.cos(ORBIT_SWEEP_RADIANS));
  const orbitEndY = cast.y - Math.sin(ORBIT_SWEEP_RADIANS) * TRISHULA_RADIUS_Y;
  const catchX = player.x + cast.direction * 26;
  const catchY = player.y - 76;
  return {
    x: orbitEndX + (catchX - orbitEndX) * eased,
    y: orbitEndY + (catchY - orbitEndY) * eased - Math.sin(progress * Math.PI) * 36,
    phase: progress >= 1 ? "complete" : "return",
    progress,
  };
};
