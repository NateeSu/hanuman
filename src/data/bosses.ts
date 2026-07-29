import type { HostileProjectileKind } from "../systems/projectileMotion";
import type { LevelId } from "./types";

export type BossStyle =
  | "gatekeeper"
  | "elephant"
  | "golem"
  | "queen"
  | "matchanu"
  | "gaoler"
  | "maiyarap";

export interface BossProfile {
  style: BossStyle;
  maxHealth: number;
  glowColor: number;
  projectile: HostileProjectileKind;
  spawnX: number;
  floating: boolean;
  displaySize: { width: number; height: number };
  /** Collision size in rendered world pixels, independent of source texture size. */
  body: { width: number; height: number };
  actionDelay: { phase1: number; phase2: number };
  damage: { phase1: number; phase2: number };
}

export const STANDARD_ENEMY_DISPLAY_HEIGHT = 122;
export const BOSS_MIN_DISPLAY_HEIGHT = STANDARD_ENEMY_DISPLAY_HEIGHT * 2;

const BOSS_PROFILES: Record<LevelId, BossProfile> = {
  1: {
    style: "gatekeeper",
    maxHealth: 205,
    glowColor: 0xffc85f,
    projectile: "shield-disc",
    spawnX: 3690,
    floating: false,
    displaySize: { width: 300, height: 293 },
    body: { width: 150, height: 230 },
    actionDelay: { phase1: 1250, phase2: 900 },
    damage: { phase1: 18, phase2: 20 },
  },
  2: {
    style: "elephant",
    maxHealth: 270,
    glowColor: 0x72efff,
    projectile: "tusk-wave",
    spawnX: 3580,
    floating: false,
    displaySize: { width: 450, height: 380 },
    body: { width: 300, height: 230 },
    actionDelay: { phase1: 1350, phase2: 1020 },
    damage: { phase1: 17, phase2: 21 },
  },
  3: {
    style: "golem",
    maxHealth: 300,
    glowColor: 0xff9a3d,
    projectile: "magma-boulder",
    spawnX: 3570,
    floating: false,
    displaySize: { width: 320, height: 384 },
    body: { width: 170, height: 310 },
    actionDelay: { phase1: 1500, phase2: 1100 },
    damage: { phase1: 18, phase2: 22 },
  },
  4: {
    style: "queen",
    maxHealth: 255,
    glowColor: 0xff8bf4,
    projectile: "lotus-stinger",
    spawnX: 3570,
    floating: true,
    displaySize: { width: 470, height: 301 },
    body: { width: 250, height: 145 },
    actionDelay: { phase1: 1280, phase2: 900 },
    damage: { phase1: 14, phase2: 18 },
  },
  5: {
    style: "matchanu",
    maxHealth: 240,
    glowColor: 0x56f0cf,
    projectile: "tidal-trident",
    spawnX: 3585,
    floating: true,
    displaySize: { width: 288, height: 260 },
    body: { width: 140, height: 220 },
    actionDelay: { phase1: 1250, phase2: 900 },
    damage: { phase1: 17, phase2: 20 },
  },
  6: {
    style: "gaoler",
    maxHealth: 285,
    glowColor: 0xb7ff63,
    projectile: "chain-sigil",
    spawnX: 3550,
    floating: false,
    displaySize: { width: 287, height: 340 },
    body: { width: 135, height: 270 },
    actionDelay: { phase1: 1320, phase2: 940 },
    damage: { phase1: 16, phase2: 20 },
  },
  7: {
    style: "maiyarap",
    maxHealth: 340,
    glowColor: 0xe6ff68,
    projectile: "hypnosis-orb",
    spawnX: 3530,
    floating: false,
    displaySize: { width: 292, height: 310 },
    body: { width: 140, height: 250 },
    actionDelay: { phase1: 1180, phase2: 820 },
    damage: { phase1: 19, phase2: 23 },
  },
};

export const bossProfileFor = (levelId: LevelId): BossProfile =>
  BOSS_PROFILES[levelId];
