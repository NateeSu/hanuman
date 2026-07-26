import Phaser from "phaser";
import { saveStore } from "../storage/saveStore";
import { touchInput } from "../systems/touchInput";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  create(): void {
    saveStore.get();
    touchInput.initialize();
    this.scene.start("PreloadScene");
  }
}
