import Phaser from "phaser";
import { LEVEL_COUNT, levelById } from "../data/levels";
import { t } from "../data/i18n";
import type { LevelId } from "../data/types";
import { saveStore } from "../storage/saveStore";
import { ratingFor } from "../systems/progression";
import { FONT_FAMILY, formatTime, makeButton, makeTitle } from "../ui/components";

interface ResultData {
  levelId: LevelId;
  timeMs: number;
  damageTaken: number;
  collectibles: number;
}

export class ResultScene extends Phaser.Scene {
  private dataValue!: ResultData;

  constructor() {
    super("ResultScene");
  }

  init(data: ResultData): void {
    this.dataValue = data;
  }

  create(): void {
    document.querySelector<HTMLElement>("#touch-controls")!.hidden = true;
    const lang = saveStore.get().settings.language;
    const level = levelById(this.dataValue.levelId);
    this.add.image(640, 360, level.background).setDisplaySize(1280, 720);
    this.add.rectangle(640, 360, 1280, 720, 0x050716, 0.7);
    const rating = ratingFor(
      this.dataValue.timeMs,
      this.dataValue.damageTaken,
      this.dataValue.collectibles,
    );
    makeTitle(this, 640, 100, t(lang, ["victory", "hero", "legend"][rating] as "victory"), 62);
    this.add
      .text(640, 165, level.title[lang], {
        fontFamily: FONT_FAMILY,
        fontSize: "25px",
        color: "#e6c77c",
      })
      .setOrigin(0.5);
    const panel = this.add.rectangle(640, 330, 650, 235, 0x0a1022, 0.93).setStrokeStyle(2, level.accent, 0.8);
    const rows = [
      [t(lang, "time"), formatTime(this.dataValue.timeMs)],
      [t(lang, "damage"), `${this.dataValue.damageTaken}`],
      [t(lang, "collectibles"), `${this.dataValue.collectibles}/3`],
    ];
    rows.forEach(([label, value], index) => {
      const y = 270 + index * 62;
      this.add
        .text(390, y, label, {
          fontFamily: FONT_FAMILY,
          fontSize: "22px",
          color: "#a9bad2",
        })
        .setOrigin(0, 0.5);
      this.add
        .text(890, y, value, {
          fontFamily: FONT_FAMILY,
          fontSize: "25px",
          fontStyle: "bold",
          color: "#fff2c6",
        })
        .setOrigin(1, 0.5);
    });
    panel.setDepth(-1);
    makeButton(this, 480, 535, t(lang, "retry"), () => this.scene.start(level.sceneKey), { width: 270 });
    makeButton(
      this,
      800,
      535,
      this.dataValue.levelId === LEVEL_COUNT
        ? lang === "th"
          ? "ชมบทส่งท้าย"
          : "View Ending"
        : t(lang, "next"),
      () =>
        this.scene.start(
          this.dataValue.levelId === LEVEL_COUNT
            ? "EndingScene"
            : "StoryScene",
          this.dataValue.levelId === LEVEL_COUNT
            ? undefined
            : { levelId: this.dataValue.levelId + 1 },
        ),
      { width: 300, accent: level.accent },
    );
    makeButton(this, 640, 630, t(lang, "menu"), () => this.scene.start("MainMenuScene"), { width: 260 });
  }
}
