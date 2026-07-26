import Phaser from "phaser";
import { saveStore } from "../storage/saveStore";
import { t } from "../data/i18n";
import { makeButton, makeTitle } from "../ui/components";

export class PauseScene extends Phaser.Scene {
  private owner = "";

  constructor() {
    super("PauseScene");
  }

  init(data: { owner: string }): void {
    this.owner = data.owner;
  }

  create(): void {
    const lang = saveStore.get().settings.language;
    this.add.rectangle(640, 360, 1280, 720, 0x03040d, 0.78);
    makeTitle(this, 640, 200, t(lang, "paused"), 58);
    makeButton(this, 640, 330, t(lang, "resume"), () => {
      this.scene.stop();
      this.scene.resume(this.owner);
    });
    makeButton(this, 640, 420, t(lang, "settings"), () => {
      this.scene.stop(this.owner);
      this.scene.start("SettingsScene");
    });
    makeButton(this, 640, 510, t(lang, "menu"), () => {
      this.scene.stop(this.owner);
      this.scene.start("MainMenuScene");
    });
    this.input.keyboard?.once("keydown-ESC", () => {
      this.scene.stop();
      this.scene.resume(this.owner);
    });
  }
}
