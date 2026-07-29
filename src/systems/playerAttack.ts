export type AttackDirection = -1 | 1;

export const NORMAL_ATTACK_PROFILE = {
  damage: 28,
  durationMs: 280,
  forwardOffset: 125,
  verticalOffset: -55,
  width: 220,
  height: 180,
} as const;

export interface NormalAttackPayload {
  originX: number;
  originY: number;
  centerX: number;
  centerY: number;
  left: number;
  top: number;
  width: number;
  height: number;
  damage: number;
  direction: AttackDirection;
  durationMs: number;
  isSkill: boolean;
}

export const createNormalAttack = (
  originX: number,
  originY: number,
  direction: AttackDirection,
): NormalAttackPayload => {
  const centerX = originX + direction * NORMAL_ATTACK_PROFILE.forwardOffset;
  const centerY = originY + NORMAL_ATTACK_PROFILE.verticalOffset;

  return {
    originX,
    originY,
    centerX,
    centerY,
    left: centerX - NORMAL_ATTACK_PROFILE.width / 2,
    top: centerY - NORMAL_ATTACK_PROFILE.height / 2,
    width: NORMAL_ATTACK_PROFILE.width,
    height: NORMAL_ATTACK_PROFILE.height,
    damage: NORMAL_ATTACK_PROFILE.damage,
    direction,
    durationMs: NORMAL_ATTACK_PROFILE.durationMs,
    isSkill: false,
  };
};
