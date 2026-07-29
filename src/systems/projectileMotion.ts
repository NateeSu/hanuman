export type HostileProjectileKind =
  | "arrow"
  | "mage-orb"
  | "bat-bolt"
  | "boss-wave"
  | "shield-disc"
  | "tusk-wave"
  | "magma-boulder"
  | "lotus-stinger"
  | "chain-sigil"
  | "tidal-trident"
  | "hypnosis-orb";

export const PROJECTILE_SPEED: Record<HostileProjectileKind, number> = {
  arrow: 500,
  "mage-orb": 285,
  "bat-bolt": 350,
  "boss-wave": 390,
  "shield-disc": 345,
  "tusk-wave": 430,
  "magma-boulder": 315,
  "lotus-stinger": 455,
  "chain-sigil": 325,
  "tidal-trident": 445,
  "hypnosis-orb": 260,
};

export const getProjectileVelocity = (
  kind: HostileProjectileKind,
  origin: { x: number; y: number },
  target: { x: number; y: number },
): { x: number; y: number } => {
  const dx = target.x - origin.x;
  const dy =
    kind === "boss-wave" ||
    kind === "tusk-wave" ||
    kind === "tidal-trident"
      ? 0
      : target.y - origin.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  return {
    x: (dx / length) * PROJECTILE_SPEED[kind],
    y: (dy / length) * PROJECTILE_SPEED[kind],
  };
};
