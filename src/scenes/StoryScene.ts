import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import { levelById } from "../data/levels";
import { storyChapterById } from "../data/story";
import type { LevelId } from "../data/types";
import { saveStore } from "../storage/saveStore";
import { FONT_FAMILY, makeButton } from "../ui/components";

interface StorySceneData {
  levelId: LevelId;
}

export class StoryScene extends Phaser.Scene {
  private levelId: LevelId = 1;
  private leaving = false;
  private readonly beginHandler = () => this.beginLevel();

  constructor() {
    super("StoryScene");
  }

  init(data: StorySceneData): void {
    this.levelId = data.levelId ?? 1;
    this.leaving = false;
  }

  create(): void {
    document.querySelector<HTMLElement>("#touch-controls")!.hidden = true;
    const language = saveStore.get().settings.language;
    const level = levelById(this.levelId);
    const chapter = storyChapterById(this.levelId);
    const accentHex = `#${level.accent.toString(16).padStart(6, "0")}`;

    const backdrop = this.add
      .image(
        640,
        360,
        `story-level-${String(this.levelId).padStart(2, "0")}`,
      )
      .setDisplaySize(1280, 720);
    this.tweens.add({
      targets: backdrop,
      scaleX: backdrop.scaleX * 1.035,
      scaleY: backdrop.scaleY * 1.035,
      duration: 9000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    const veil = this.add.graphics();
    veil.fillGradientStyle(
      0x040817,
      0x081126,
      0x040817,
      0x081126,
      0.88,
      0.04,
      0.88,
      0.06,
    );
    veil.fillRect(0, 0, 1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x050817, 0.05);

    this.drawOrnament(level.accent);

    const chapterText = language === "th"
      ? `บทที่ ${String(this.levelId).padStart(2, "0")}  •  รามเกียรติ์ ตอนศึกไมยราพ`
      : `CHAPTER ${String(this.levelId).padStart(2, "0")}  •  THE BATTLE OF MAIYARAP`;
    const chapterLabel = this.add
      .text(82, 72, chapterText, {
        fontFamily: FONT_FAMILY,
        fontSize: "16px",
        fontStyle: "bold",
        color: accentHex,
        letterSpacing: language === "th" ? 1 : 3,
      })
      .setAlpha(0);
    const title = this.add
      .text(80, 112, level.title[language], {
        fontFamily: FONT_FAMILY,
        fontSize: language === "th" ? "48px" : "43px",
        fontStyle: "bold",
        color: "#fff3d2",
        stroke: "#060812",
        strokeThickness: 7,
        wordWrap: { width: 610 },
      })
      .setAlpha(0);
    const subtitle = this.add
      .text(84, 175, level.subtitle[language], {
        fontFamily: FONT_FAMILY,
        fontSize: "19px",
        color: "#c8d7e8",
        wordWrap: { width: 570 },
      })
      .setAlpha(0);

    const beatObjects = chapter.beats.map((beat, index) => {
      const y = 249 + index * 108;
      const marker = this.add
        .circle(94, y + 7, 15, level.accent, 0.14)
        .setStrokeStyle(2, level.accent, 0.9)
        .setAlpha(0);
      const number = this.add
        .text(94, y + 7, `${index + 1}`, {
          fontFamily: FONT_FAMILY,
          fontSize: "14px",
          fontStyle: "bold",
          color: "#fff3cf",
        })
        .setOrigin(0.5)
        .setAlpha(0);
      const text = this.add
        .text(126, y - 12, beat[language], {
          fontFamily: FONT_FAMILY,
          fontSize: language === "th" ? "20px" : "18px",
          color: "#eef3fb",
          lineSpacing: 7,
          wordWrap: { width: 545 },
        })
        .setAlpha(0);
      return [marker, number, text];
    });

    const loreLine = this.add.rectangle(82, 474, 570, 2, level.accent, 0.72).setOrigin(0, 0.5).setAlpha(0);
    const loreLabel = this.add
      .text(82, 493, language === "th" ? "เกร็ดวรรณคดี" : "LITERARY NOTE", {
        fontFamily: FONT_FAMILY,
        fontSize: "14px",
        fontStyle: "bold",
        color: accentHex,
        letterSpacing: language === "th" ? 1 : 2,
      })
      .setAlpha(0);
    const lore = this.add
      .text(82, 522, chapter.lore[language], {
        fontFamily: FONT_FAMILY,
        fontSize: language === "th" ? "17px" : "16px",
        color: "#d7cba9",
        lineSpacing: 5,
        wordWrap: { width: 575 },
      })
      .setAlpha(0);

    const begin = makeButton(
      this,
      1072,
      606,
      language === "th" ? "เริ่มการผจญภัย  ›" : "BEGIN THE JOURNEY  ›",
      this.beginHandler,
      { width: 330, height: 58, fontSize: 20, accent: level.accent },
    )
      .setDepth(20)
      .setAlpha(0);
    this.add
      .text(
        1072,
        654,
        language === "th" ? "กด ENTER หรือ SPACE เพื่อเริ่มด่าน" : "PRESS ENTER OR SPACE TO BEGIN",
        {
          fontFamily: FONT_FAMILY,
          fontSize: "12px",
          color: "#98a8bd",
          letterSpacing: language === "th" ? 0 : 1,
        },
      )
      .setOrigin(0.5)
      .setAlpha(0.8);

    this.drawProgress(level.accent);

    const narrativeObjects = [
      chapterLabel,
      title,
      subtitle,
      ...beatObjects.flat(),
      loreLine,
      loreLabel,
      lore,
      begin,
    ];
    this.tweens.add({
      targets: narrativeObjects,
      alpha: 1,
      x: "+=8",
      duration: 650,
      ease: "Cubic.easeOut",
      stagger: 65,
    });

    this.input.keyboard?.on("keydown-ENTER", this.beginHandler);
    this.input.keyboard?.on("keydown-SPACE", this.beginHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown-ENTER", this.beginHandler);
      this.input.keyboard?.off("keydown-SPACE", this.beginHandler);
    });
    this.cameras.main.fadeIn(420, 3, 6, 17);
  }

  private drawOrnament(accent: number): void {
    const frame = this.add.graphics().setDepth(10);
    frame.lineStyle(2, 0xd9ae5a, 0.62);
    frame.strokeRect(28, 26, 1224, 668);
    frame.lineStyle(1, accent, 0.32);
    frame.strokeRect(36, 34, 1208, 652);
    [
      [50, 48],
      [1230, 48],
      [50, 672],
      [1230, 672],
    ].forEach(([x, y], index) => {
      const directionX = index % 2 === 0 ? 1 : -1;
      const directionY = index < 2 ? 1 : -1;
      frame.lineStyle(3, 0xd9ae5a, 0.78);
      frame.lineBetween(x, y, x + directionX * 44, y);
      frame.lineBetween(x, y, x, y + directionY * 44);
      frame.fillStyle(0xd9ae5a, 0.82);
      frame.fillCircle(x, y, 4);
      frame.fillCircle(x + directionX * 22, y + directionY * 6, 3);
    });
  }

  private drawProgress(accent: number): void {
    const startX = 84;
    for (let id = 1; id <= 7; id += 1) {
      const active = id === this.levelId;
      const completed = id < this.levelId;
      this.add
        .circle(startX + (id - 1) * 37, 660, active ? 7 : 4, active ? accent : completed ? 0xd9ae5a : 0x7e8da2, active ? 1 : 0.62)
        .setStrokeStyle(active ? 2 : 0, 0xffe3a0, 0.9);
    }
  }

  private beginLevel(): void {
    if (this.leaving) return;
    this.leaving = true;
    audioDirector.unlock();
    const sceneKey = levelById(this.levelId).sceneKey;
    this.cameras.main.fadeOut(360, 3, 6, 17);
    this.time.delayedCall(380, () => this.scene.start(sceneKey));
  }
}
