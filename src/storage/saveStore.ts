import { isLevelId } from "../data/levels";
import type {
  GameSaveV1,
  GameSettings,
  LevelId,
  LevelStats,
} from "../data/types";
import { unlockedAfterCompletion } from "../systems/progression";

export const SAVE_KEY = "hanuman_maiyarap_save_v1";
export const CORRUPT_KEY = `${SAVE_KEY}_corrupt`;

export const defaultSettings = (): GameSettings => ({
  musicVolume: 0.45,
  sfxVolume: 0.7,
  muted: false,
  quality: "auto",
  screenShake: true,
  touchOpacity: 0.72,
  language: "th",
});

export const createDefaultSave = (): GameSaveV1 => ({
  version: 1,
  contentRevision: 2,
  updatedAt: new Date().toISOString(),
  unlockedLevel: 1,
  completedLevels: [],
  levelStats: {},
  settings: defaultSettings(),
});

export const isGameSave = (value: unknown): value is GameSaveV1 => {
  if (!value || typeof value !== "object") return false;
  const save = value as Partial<GameSaveV1>;
  return (
    save.version === 1 &&
    save.contentRevision === 2 &&
    isLevelId(save.unlockedLevel ?? 0) &&
    Array.isArray(save.completedLevels) &&
    !!save.levelStats &&
    typeof save.levelStats === "object" &&
    !!save.settings &&
    typeof save.settings.musicVolume === "number" &&
    typeof save.settings.sfxVolume === "number" &&
    ["th", "en"].includes(save.settings.language)
  );
};

interface LegacySaveV1 {
  version: 1;
  updatedAt?: string;
  unlockedLevel: 1 | 2 | 3;
  completedLevels: number[];
  latestCheckpoint?: {
    levelId: number;
    checkpointId: string;
  };
  levelStats: Record<string, LevelStats>;
  settings: GameSettings;
}

const isLegacySave = (value: unknown): value is LegacySaveV1 => {
  if (!value || typeof value !== "object") return false;
  const save = value as Partial<LegacySaveV1> & {
    contentRevision?: number;
  };
  return (
    save.version === 1 &&
    save.contentRevision === undefined &&
    [1, 2, 3].includes(save.unlockedLevel ?? 0) &&
    Array.isArray(save.completedLevels) &&
    !!save.levelStats &&
    typeof save.levelStats === "object" &&
    !!save.settings &&
    typeof save.settings.musicVolume === "number" &&
    typeof save.settings.sfxVolume === "number" &&
    ["th", "en"].includes(save.settings.language)
  );
};

export const migrateLegacySave = (legacy: LegacySaveV1): GameSaveV1 => {
  const completedThroughMatchanu =
    legacy.completedLevels.includes(2) || legacy.unlockedLevel === 3;
  const completedFinal = legacy.completedLevels.includes(3);
  const completedLevels = completedFinal
    ? [1, 2, 3, 4, 5, 6, 7]
    : completedThroughMatchanu
      ? [1, 2, 3, 4, 5]
      : legacy.completedLevels.includes(1)
        ? [1]
        : [];
  const unlockedLevel: LevelId = completedFinal
    ? 7
    : completedThroughMatchanu
      ? 6
      : legacy.unlockedLevel === 2
        ? 2
        : 1;

  const levelStats: Record<string, LevelStats> = {};
  const legacyToExpanded = new Map([
    ["1", "1"],
    ["2", "5"],
    ["3", "7"],
  ]);
  legacyToExpanded.forEach((expandedId, legacyId) => {
    const stats = legacy.levelStats[legacyId];
    if (stats) levelStats[expandedId] = structuredClone(stats);
  });
  completedLevels.forEach((levelId) => {
    levelStats[String(levelId)] ??= {
      collectibles: [],
      completed: true,
    };
  });

  const checkpointMap = new Map<number, LevelId>([
    [1, 1],
    [2, 5],
    [3, 7],
  ]);
  const checkpointLevel = legacy.latestCheckpoint
    ? checkpointMap.get(legacy.latestCheckpoint.levelId)
    : undefined;

  return {
    version: 1,
    contentRevision: 2,
    updatedAt: new Date().toISOString(),
    unlockedLevel,
    completedLevels,
    latestCheckpoint:
      checkpointLevel && legacy.latestCheckpoint
        ? {
            levelId: checkpointLevel,
            checkpointId: legacy.latestCheckpoint.checkpointId,
          }
        : undefined,
    levelStats,
    settings: structuredClone(legacy.settings),
  };
};

export const parseSave = (raw: string | null): GameSaveV1 => {
  if (!raw) return createDefaultSave();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isGameSave(parsed)) return parsed;
    return isLegacySave(parsed) ? migrateLegacySave(parsed) : createDefaultSave();
  } catch {
    return createDefaultSave();
  }
};

class SaveStore {
  private save: GameSaveV1;
  private readonly storage =
    typeof window !== "undefined" && typeof window.localStorage?.getItem === "function"
      ? window.localStorage
      : undefined;

  constructor() {
    const raw = this.storage?.getItem(SAVE_KEY) ?? null;
    this.save = parseSave(raw);
    const parsed = raw ? this.tryParse(raw) : null;
    if (raw && !isGameSave(parsed) && !isLegacySave(parsed)) {
      this.storage?.setItem(CORRUPT_KEY, raw);
    }
    this.persist();
  }

  private tryParse(raw: string): unknown {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  get(): GameSaveV1 {
    return structuredClone(this.save);
  }

  updateSettings(settings: Partial<GameSettings>): void {
    this.save.settings = { ...this.save.settings, ...settings };
    this.persist();
  }

  setCheckpoint(levelId: number, checkpointId: string): void {
    this.save.latestCheckpoint = { levelId, checkpointId };
    this.persist();
  }

  collect(levelId: number, collectibleId: string): void {
    const stats = this.ensureStats(levelId);
    if (!stats.collectibles.includes(collectibleId)) stats.collectibles.push(collectibleId);
    this.persist();
  }

  completeLevel(levelId: number, timeMs: number, damageTaken: number): void {
    const stats = this.ensureStats(levelId);
    stats.completed = true;
    stats.bestTimeMs = Math.min(stats.bestTimeMs ?? Number.POSITIVE_INFINITY, timeMs);
    stats.damageTaken = Math.min(stats.damageTaken ?? Number.POSITIVE_INFINITY, damageTaken);
    if (!this.save.completedLevels.includes(levelId)) this.save.completedLevels.push(levelId);
    this.save.unlockedLevel = unlockedAfterCompletion(
      this.save.unlockedLevel,
      levelId,
    );
    delete this.save.latestCheckpoint;
    this.persist();
  }

  clear(): void {
    this.save = createDefaultSave();
    this.persist();
  }

  private ensureStats(levelId: number): LevelStats {
    const key = String(levelId);
    this.save.levelStats[key] ??= { collectibles: [], completed: false };
    return this.save.levelStats[key];
  }

  private persist(): void {
    this.save.updatedAt = new Date().toISOString();
    this.storage?.setItem(SAVE_KEY, JSON.stringify(this.save));
  }
}

export const saveStore = new SaveStore();
