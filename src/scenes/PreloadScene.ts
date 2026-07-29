import Phaser from "phaser";
import { LEVEL_COUNT } from "../data/levels";
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
  "khotchasan",
  "akkhani",
  "masaka",
  "than-lek",
];

const bossPoseTextures = [
  "gatekeeper",
  "khotchasan",
  "akkhani",
  "masaka",
  "matchanu",
  "than-lek",
  "maiyarap",
];
const bossPoses = ["idle", "cast", "strike"];

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
    this.load.image("developer-family-logo", "/assets/ui/branding/developer-father-son-logo.png");
    this.load.once("filecomplete-image-poster", () => this.showPoster());
    Array.from({ length: LEVEL_COUNT }, (_, index) => index + 1).forEach(
      (levelId) => {
        const paddedId = levelId.toString().padStart(2, "0");
        this.load.image(
          `level-${paddedId}`,
          `/assets/levels/level-${paddedId}/background.webp`,
        );
        this.load.image(
          `story-level-${paddedId}`,
          `/assets/story/level-${paddedId}.webp`,
        );
      },
    );
    hanumanPoses.forEach((pose) =>
      this.load.image(`hanuman-${pose}`, `/assets/characters/hanuman/poses/${pose}.png`),
    );
    roster.forEach((name) =>
      this.load.image(name, `/assets/characters/roster/poses/${name}.png`),
    );
    bossPoseTextures.forEach((name) =>
      bossPoses.forEach((pose) =>
        this.load.image(
          `${name}-${pose}`,
          `/assets/characters/roster/poses/${name}-${pose}.webp`,
        ),
      ),
    );
    objects.forEach((name) => this.load.image(name, `/assets/ui/objects/${name}.png`));
    this.load.image("trishula-ultimate", "/assets/ui/vfx/trishula-ultimate.png");
    this.load.image("projectile-arrow", "/assets/projectiles/yak-arrow.png");
    this.load.image("projectile-mage-orb", "/assets/projectiles/mage-orb.png");
    this.load.image("projectile-bat-bolt", "/assets/projectiles/bat-bolt.png");
    this.load.image("projectile-boss-wave", "/assets/projectiles/boss-wave.png");
    this.load.image(
      "projectile-shield-disc",
      "/assets/projectiles/shield-disc.png",
    );
    this.load.image("projectile-tusk-wave", "/assets/projectiles/tusk-wave.png");
    this.load.image(
      "projectile-magma-boulder",
      "/assets/projectiles/magma-boulder.png",
    );
    this.load.image(
      "projectile-lotus-stinger",
      "/assets/projectiles/lotus-stinger.png",
    );
    this.load.image(
      "projectile-chain-sigil",
      "/assets/projectiles/chain-sigil.png",
    );
    this.load.image(
      "projectile-tidal-trident",
      "/assets/projectiles/tidal-trident.png",
    );
    this.load.image(
      "projectile-hypnosis-orb",
      "/assets/projectiles/hypnosis-orb.png",
    );

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
        const requestedEnding =
          import.meta.env.DEV &&
          new URLSearchParams(window.location.search).get("ending") === "1";
        const target = requestedEnding
          ? "EndingScene"
          : requestedLevel &&
          Array.from({ length: LEVEL_COUNT }, (_, index) =>
            String(index + 1),
          ).includes(requestedLevel)
            ? "StoryScene"
            : "MainMenuScene";
        this.scene.start(
          target,
          target === "StoryScene" ? { levelId: Number(requestedLevel) } : undefined,
        );
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
