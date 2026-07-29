import { describe, expect, it } from "vitest";
import { ratingFor, unlockedAfterCompletion } from "../src/systems/progression";

describe("progression", () => {
  it("unlocks the next level but never exceeds level 7", () => {
    expect(unlockedAfterCompletion(1, 1)).toBe(2);
    expect(unlockedAfterCompletion(2, 2)).toBe(3);
    expect(unlockedAfterCompletion(6, 6)).toBe(7);
    expect(unlockedAfterCompletion(7, 7)).toBe(7);
  });

  it("rates a complete, fast, low-damage run as legend", () => {
    expect(ratingFor(180_000, 20, 3)).toBe(2);
    expect(ratingFor(500_000, 80, 1)).toBe(0);
  });
});
