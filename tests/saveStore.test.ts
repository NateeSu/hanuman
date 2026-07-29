import { describe, expect, it } from "vitest";
import {
  createDefaultSave,
  isGameSave,
  migrateLegacySave,
  parseSave,
} from "../src/storage/saveStore";

describe("save data", () => {
  it("creates a valid versioned default save", () => {
    const save = createDefaultSave();
    expect(save.version).toBe(1);
    expect(save.contentRevision).toBe(2);
    expect(save.unlockedLevel).toBe(1);
    expect(isGameSave(save)).toBe(true);
  });

  it("recovers from corrupt JSON", () => {
    const save = parseSave("{broken");
    expect(save.version).toBe(1);
    expect(save.completedLevels).toEqual([]);
  });

  it("rejects an invalid shape", () => {
    expect(isGameSave({ version: 1, unlockedLevel: 99 })).toBe(false);
  });

  it("migrates the former Matchanu checkpoint to expanded level 5", () => {
    const migrated = migrateLegacySave({
      version: 1,
      unlockedLevel: 3,
      completedLevels: [1, 2],
      latestCheckpoint: { levelId: 2, checkpointId: "cp-2" },
      levelStats: {
        "1": { collectibles: ["seal-1"], completed: true },
        "2": { collectibles: ["seal-2"], completed: true },
      },
      settings: createDefaultSave().settings,
    });
    expect(migrated.unlockedLevel).toBe(6);
    expect(migrated.completedLevels).toEqual([1, 2, 3, 4, 5]);
    expect(migrated.latestCheckpoint?.levelId).toBe(5);
    expect(migrated.levelStats["5"]?.collectibles).toEqual(["seal-2"]);
  });
});
