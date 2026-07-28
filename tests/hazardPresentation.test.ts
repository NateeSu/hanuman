import { describe, expect, it } from "vitest";
import {
  getHazardPresentation,
  type HazardTexture,
} from "../src/systems/hazardPresentation";

describe("hazard presentation", () => {
  const textures: HazardTexture[] = ["sleep-mist", "blade-trap"];

  it.each(textures)("keeps the %s hitbox inside its visible art", (texture) => {
    const presentation = getHazardPresentation(texture);

    expect(presentation.hitboxWidth).toBeLessThan(presentation.displayWidth);
    expect(presentation.hitboxHeight).toBeLessThan(presentation.displayHeight);
  });

  it.each(textures)("telegraphs %s beyond its damage area", (texture) => {
    const presentation = getHazardPresentation(texture);

    expect(presentation.telegraphWidth).toBeGreaterThan(presentation.hitboxWidth);
    expect(presentation.telegraphHeight).toBeGreaterThan(0);
    expect(presentation.damage).toBeGreaterThan(0);
  });
});
