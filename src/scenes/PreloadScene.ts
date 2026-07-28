import Phaser from "phaser";
import { FONT_FAMILY } from "../ui/components";

const hanumanPoses = [
  "idle",
  "run-a",
  "run-b",
  "jump",
  "fall",
  "dash",
  "attack-1",
  "attack-2",
  "heavy",
  "air-attack",
  "hurt",
  "victory",
];

const roster = [
  "gatekeeper",
  "matchanu",
  "maiyarap",
  "rama",
  "yak-guard",
  "yak-archer",
  "bat-spirit",
  "shadow-mage",
];

const objects = [
  "rama-seal",
  "checkpoint",
  "dash-wall",
  "sleep-mist",
  "heart-reliquary",
  "heart-seal",
  "blade-trap",
  "exit-portal",
];

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload(): void {
    this.load.image("poster", "/assets/poster/opening-poster.webp");
    this.load.once("filecomplete-image-poster", () => this.showPoster());
    this.load.image("level-01", "/assets/levels/level-01/background.webp");
    this.load.image("level-02", "/assets/levels/level-02/background.webp");
    this.load.image("level-03", "/assets/levels/level-03/background.webp");
    hanumanPoses.forEach((pose) =>
      this.load.image(`hanuman-${pose}`, `/assets/characters/hanuman/poses/${pose}.png`),
    );
    roster.forEach((name) =>
      this.load.image(name, `/assets/characters/roster/poses/${name}.png`),
    );
    objects.forEach((name) => this.load.image(name, `/assets/ui/objects/${name}.png`));
    this.load.image("trishula-ultimate", "/assets/ui/vfx/trishula-ultimate.png");
    this.load.image("projectile-arrow", "/assets/projectiles/yak-arrow.png");
    this.load.image("projectile-mage-orb", "/assets/projectiles/mage-orb.png");
    this.load.image("projectile-bat-bolt", "/assets/projectiles/bat-bolt.png");
    this.load.image("projectile-boss-wave", "/assets/projectiles/boss-wave.png");

    const barBg = this.add
      .rectangle(640, 650, 430, 8, 0x172039, 0.9)
      .setStrokeStyle(1, 0xd9ae5a, 0.65)
      .setDepth(100);
    const bar = this.add.rectangle(426, 650, 2, 6, 0x63e6ff, 1).setOrigin(0, 0.5).setDepth(101);
    const loading = this.add
      .text(640, 620, "กำลังเปิดประตูบาดาล • OPENING THE UNDERWORLD", {
        fontFamily: FONT_FAMILY,
        fontSize: "16px",
        color: "#d8e8ff",
        letterSpacing: 2,
      })
      .setOrigin(0.5)
      .setDepth(101);
    this.load.on("progress", (value: number) => {
      bar.width = Math.max(2, 428 * value);
      loading.setAlpha(0.72 + Math.sin(this.time.now * 0.006) * 0.18);
    });
    this.load.on("complete", () => {
      barBg.setStrokeStyle(2, 0x7af4ff, 1);
      this.time.delayedCall(300, () => {
        const requestedLevel = import.meta.env.DEV
          ? new URLSearchParams(window.location.search).get("level")
          : null;
        const target =
          requestedLevel && ["1", "2", "3"].includes(requestedLevel)
            ? `Level0${requestedLevel}Scene`
            : "MainMenuScene";
        this.scene.start(target);
      });
    });
    this.load.on("loaderror", (file: Phaser.Loader.File) => {
      const panel = document.querySelector<HTMLElement>("#fatal-error");
      const message = document.querySelector<HTMLElement>("#fatal-error-message");
      if (panel && message) {
        message.textContent = `โหลดไฟล์ ${file.key} ไม่สำเร็จ กรุณาตรวจการเชื่อมต่อแล้วลองใหม่`;
        panel.hidden = false;
      }
    });
  }

  private showPoster(): void {
    const poster = this.add.image(640, 360, "poster").setDisplaySize(1280, 720).setDepth(-10);
    this.tweens.add({
      targets: poster,
      scaleX: 1.025,
      scaleY: 1.025,
      duration: 8000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
    this.add.rectangle(640, 360, 1280, 720, 0x030510, 0.12).setDepth(-9);
    this.add
      .text(78, 72, "หนุมาน", {
        fontFamily: FONT_FAMILY,
        fontSize: "72px",
        fontStyle: "bold",
        color: "#fff6d4",
        stroke: "#130c19",
        strokeThickness: 10,
      })
      .setDepth(5);
    this.add
      .text(82, 148, "ศึกไมยราพ", {
        fontFamily: FONT_FAMILY,
        fontSize: "38px",
        fontStyle: "bold",
        color: "#e8bd61",
        stroke: "#130c19",
        strokeThickness: 7,
      })
      .setDepth(5);
  }
}
