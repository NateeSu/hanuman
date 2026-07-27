export const BOSS_ARENA = {
  left: 2560,
  width: 1280,
  respawnX: 3160,
} as const;

export function resolveRespawnX(
  checkpointX: number,
  bossStarted: boolean,
  bossDefeated: boolean,
): number {
  return bossStarted && !bossDefeated ? BOSS_ARENA.respawnX : checkpointX;
}
