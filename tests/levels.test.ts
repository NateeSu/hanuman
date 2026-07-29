import { describe, expect, it } from "vitest";
import { LEVEL_COUNT, LEVELS, levelById } from "../src/data/levels";
import {
  BOSS_MIN_DISPLAY_HEIGHT,
  bossProfileFor,
} from "../src/data/bosses";

describe("expanded campaign data", () => {
  it("defines seven sequential playable scenes", () => {
    expect(LEVELS).toHaveLength(LEVEL_COUNT);
    expect(LEVELS.map((level) => level.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(LEVELS.map((level) => level.sceneKey)).toEqual([
      "Level01Scene",
      "Level02Scene",
      "Level03Scene",
      "Level04Scene",
      "Level05Scene",
      "Level06Scene",
      "Level07Scene",
    ]);
    expect(levelById(5).bossTexture).toBe("matchanu");
    expect(levelById(7).bossTexture).toBe("maiyarap");
  });

  it("gives all seven bosses distinct powers and at least double enemy height", () => {
    const profiles = LEVELS.map((level) => bossProfileFor(level.id));
    expect(new Set(profiles.map((profile) => profile.projectile)).size).toBe(7);
    expect(new Set(profiles.map((profile) => profile.glowColor)).size).toBe(7);
    profiles.forEach((profile) => {
      expect(profile.displaySize.height).toBeGreaterThanOrEqual(
        BOSS_MIN_DISPLAY_HEIGHT,
      );
    });
    expect(bossProfileFor(4).floating).toBe(true);
  });
});
