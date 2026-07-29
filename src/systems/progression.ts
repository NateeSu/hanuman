import type { LevelId } from "../data/types";

export const unlockedAfterCompletion = (
  currentUnlocked: LevelId,
  completedLevel: number,
): LevelId =>
  Math.max(currentUnlocked, Math.min(7, completedLevel + 1)) as LevelId;

export const ratingFor = (timeMs: number, damage: number, collectibles: number): 0 | 1 | 2 => {
  const score = (timeMs < 240_000 ? 1 : 0) + (damage <= 30 ? 1 : 0) + (collectibles === 3 ? 1 : 0);
  return score >= 3 ? 2 : score >= 2 ? 1 : 0;
};
