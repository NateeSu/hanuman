import { describe, expect, it } from "vitest";
import { createDefaultSave, isGameSave, parseSave } from "../src/storage/saveStore";

describe("save data", () => {
  it("creates a valid versioned default save", () => {
    const save = createDefaultSave();
    expect(save.version).toBe(1);
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
});
