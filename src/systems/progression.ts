export const unlockedAfterCompletion = (
  currentUnlocked: 1 | 2 | 3,
  completedLevel: number,
): 1 | 2 | 3 => Math.max(currentUnlocked, Math.min(3, completedLevel + 1)) as 1 | 2 | 3;

export const ratingFor = (timeMs: number, damage: number, collectibles: number): 0 | 1 | 2 => {
  const score = (timeMs < 240_000 ? 1 : 0) + (damage <= 30 ? 1 : 0) + (collectibles === 3 ? 1 : 0);
  return score >= 3 ? 2 : score >= 2 ? 1 : 0;
};
