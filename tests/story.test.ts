import { describe, expect, it } from "vitest";
import { LEVEL_COUNT } from "../src/data/levels";
import { STORY_CHAPTERS, storyChapterById } from "../src/data/story";

describe("story chapters", () => {
  it("provides a complete bilingual chapter for every level", () => {
    expect(STORY_CHAPTERS).toHaveLength(LEVEL_COUNT);

    STORY_CHAPTERS.forEach((chapter, index) => {
      expect(chapter.id).toBe(index + 1);
      expect(chapter.beats).toHaveLength(2);
      chapter.beats.forEach((beat) => {
        expect(beat.th.length).toBeGreaterThan(20);
        expect(beat.en.length).toBeGreaterThan(20);
      });
      expect(chapter.lore.th.length).toBeGreaterThan(20);
      expect(chapter.lore.en.length).toBeGreaterThan(20);
    });
  });

  it("resolves chapters by level id", () => {
    expect(storyChapterById(5).id).toBe(5);
    expect(storyChapterById(7).id).toBe(7);
  });
});
