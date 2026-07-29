import Phaser from "phaser";
import { saveStore } from "../storage/saveStore";
import { FONT_FAMILY, makeButton, makeTitle } from "../ui/components";

export class DeveloperScene extends Phaser.Scene {
  constructor() {
    super("DeveloperScene");
  }

  create(): void {
    document.querySelector<HTMLElement>("#touch-controls")!.hidden = true;
    const lang = saveStore.get().settings.language;

    this.add.image(640, 360, "level-07").setDisplaySize(1280, 720).setTint(0x607c88);
    this.add.rectangle(640, 360, 1280, 720, 0x030812, 0.78);

    const atmosphere = this.add.graphics();
    atmosphere.fillGradientStyle(0x06252b, 0x071322, 0x071322, 0x10232c, 0.42, 0.08, 0.08, 0.42);
    atmosphere.fillRect(0, 0, 1280, 720);

    makeTitle(this, 640, 66, lang === "th" ? "ผู้พัฒนาเกมส์" : "Game Developers", 46);

    const panel = this.add.graphics();
    panel.fillStyle(0x071923, 0.92);
    panel.fillRoundedRect(108, 124, 1064, 468, 28);
    panel.lineStyle(2, 0xdbb45b, 0.88);
    panel.strokeRoundedRect(108, 124, 1064, 468, 28);
    panel.lineStyle(1, 0x5de6d1, 0.35);
    panel.strokeRoundedRect(116, 132, 1048, 452, 22);

    const glow = this.add.circle(390, 358, 210, 0x4fe3d0, 0.1).setStrokeStyle(2, 0xffdb77, 0.42);
    const portrait = this.add.image(390, 358, "developer-family-logo").setDisplaySize(390, 390);

    this.add
      .text(790, 275, "พัฒนาเกมส์โดย", {
        fontFamily: FONT_FAMILY,
        fontSize: "25px",
        fontStyle: "bold",
        color: "#82ded5",
        letterSpacing: 1,
      })
      .setOrigin(0.5);
    this.add
      .text(790, 340, "พ่อน๊อตและน้องเปรม", {
        fontFamily: FONT_FAMILY,
        fontSize: "40px",
        fontStyle: "bold",
        color: "#ffe5a0",
        stroke: "#071018",
        strokeThickness: 7,
        align: "center",
      })
      .setOrigin(0.5);
    this.add
      .text(790, 401, "HANUMAN · BATTLE OF MAIYARAP", {
        fontFamily: FONT_FAMILY,
        fontSize: "14px",
        color: "#92b9c8",
        letterSpacing: 2.4,
      })
      .setOrigin(0.5);

    makeButton(
      this,
      640,
      654,
      lang === "th" ? "กลับเมนู" : "Main Menu",
      () => this.scene.start("MainMenuScene"),
      { width: 260, height: 48 },
    );

    this.tweens.add({
      targets: [portrait, glow],
      y: { from: 354, to: 362 },
      alpha: { from: 0.88, to: 1 },
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }
}
