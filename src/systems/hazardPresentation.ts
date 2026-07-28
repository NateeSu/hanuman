export type HazardTexture = "sleep-mist" | "blade-trap";

export interface HazardPresentation {
  color: number;
  damage: number;
  displayWidth: number;
  displayHeight: number;
  hitboxWidth: number;
  hitboxHeight: number;
  telegraphWidth: number;
  telegraphHeight: number;
}

const HAZARD_PRESENTATIONS: Record<HazardTexture, HazardPresentation> = {
  "sleep-mist": {
    color: 0x9b7cff,
    damage: 12,
    displayWidth: 96,
    displayHeight: 134,
    hitboxWidth: 72,
    hitboxHeight: 96,
    telegraphWidth: 158,
    telegraphHeight: 48,
  },
  "blade-trap": {
    color: 0xff6847,
    damage: 12,
    displayWidth: 112,
    displayHeight: 112,
    hitboxWidth: 86,
    hitboxHeight: 86,
    telegraphWidth: 164,
    telegraphHeight: 52,
  },
};

export function getHazardPresentation(texture: HazardTexture): HazardPresentation {
  return HAZARD_PRESENTATIONS[texture];
}
