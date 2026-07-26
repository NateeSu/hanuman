import { BaseLevelScene } from "./BaseLevelScene";

export class Level01Scene extends BaseLevelScene {
  protected readonly levelId = 1 as const;
  constructor() {
    super("Level01Scene");
  }
}

export class Level02Scene extends BaseLevelScene {
  protected readonly levelId = 2 as const;
  constructor() {
    super("Level02Scene");
  }
}

export class Level03Scene extends BaseLevelScene {
  protected readonly levelId = 3 as const;
  constructor() {
    super("Level03Scene");
  }
}
