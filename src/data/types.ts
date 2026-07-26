export type Quality = "auto" | "low" | "medium" | "high";
export type Language = "th" | "en";

export interface LevelStats {
  bestTimeMs?: number;
  collectibles: string[];
  completed: boolean;
  damageTaken?: number;
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  muted: boolean;
  quality: Quality;
  screenShake: boolean;
  touchOpacity: number;
  language: Language;
}

export interface GameSaveV1 {
  version: 1;
  updatedAt: string;
  unlockedLevel: 1 | 2 | 3;
  completedLevels: number[];
  latestCheckpoint?: {
    levelId: number;
    checkpointId: string;
  };
  levelStats: Record<string, LevelStats>;
  settings: GameSettings;
}

export interface LevelDefinition {
  id: 1 | 2 | 3;
  sceneKey: string;
  title: { th: string; en: string };
  subtitle: { th: string; en: string };
  background: string;
  accent: number;
  bossName: { th: string; en: string };
  bossTexture: string;
  story: { th: string; en: string };
}
