import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const bossNames = [
  "gatekeeper",
  "khotchasan",
  "akkhani",
  "masaka",
  "matchanu",
  "than-lek",
  "maiyarap",
];
const poses = ["idle", "cast", "strike"];

describe("boss animation assets", () => {
  it("provides three rendered poses for every boss", () => {
    bossNames.forEach((boss) => {
      poses.forEach((pose) => {
        const path = resolve(
          `public/assets/characters/roster/poses/${boss}-${pose}.webp`,
        );
        expect(existsSync(path), path).toBe(true);
        expect(statSync(path).size, path).toBeGreaterThan(20_000);
      });
    });
  });

  it("provides unique projectiles for the three original bosses", () => {
    ["shield-disc", "tidal-trident", "hypnosis-orb"].forEach((projectile) => {
      const path = resolve(`public/assets/projectiles/${projectile}.png`);
      expect(existsSync(path), path).toBe(true);
      expect(statSync(path).size, path).toBeGreaterThan(10_000);
    });
  });
});
