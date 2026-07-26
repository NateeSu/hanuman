import Phaser from "phaser";
import { LEVELS } from "../data/levels";
import { saveStore } from "../storage/saveStore";
import { FONT_FAMILY, makeButton, makeTitle } from "../ui/components";

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super("LevelSelectScene");
  }

  create(): void {
    const save = saveStore.get();
    const lang = save.settings.language;
    this.add.image(640, 360, "level-03").setDisplaySize(1280, 720).setTint(0x6f789d);
    this.add.rectangle(640, 360, 1280, 720, 0x050716, 0.68);
    makeTitle(this, 640, 75, lang === "th" ? "เลือกเส้นทางศึก" : "Choose Your Battle", 46);

    LEVELS.forEach((level, index) => {
      const x = 240 + index * 400;
      const unlocked = level.id <= save.unlockedLevel;
      const completed = save.completedLevels.includes(level.id);
      const frame = this.add.rectangle(x, 320, 330, 380, 0x10172c, 0.94);
      frame.setStrokeStyle(2, unlocked ? level.accent : 0x41465b, unlocked ? 0.9 : 0.5);
      const art = this.add
        .image(x, 225, level.background)
        .setDisplaySize(300, 170)
        .setTint(unlocked ? 0xffffff : 0x424655);
      this.add
        .text(x, 338, `${level.id.toString().padStart(2, "0")} · ${level.title[lang]}`, {
          fontFamily: FONT_FAMILY,
          fontSize: "21px",
          fontStyle: "bold",
          color: unlocked ? "#fff4d1" : "#777d91",
          align: "center",
          wordWrap: { width: 285 },
        })
        .setOrigin(0.5);
      this.add
        .text(x, 392, unlocked ? level.subtitle[lang] : lang === "th" ? "ยังไม่ปลดล็อก" : "Locked", {
          fontFamily: FONT_FAMILY,
          fontSize: "15px",
          color: unlocked ? "#a8c6d8" : "#6d7285",
          align: "center",
          wordWrap: { width: 280 },
        })
        .setOrigin(0.5);
      if (completed) {
        this.add
          .text(x + 130, 153, "✓", {
            fontFamily: FONT_FAMILY,
            fontSize: "28px",
            color: "#72f2c5",
          })
          .setOrigin(0.5);
      }
      makeButton(
        this,
        x,
        468,
        unlocked ? (lang === "th" ? "เริ่มด่าน" : "Begin") : "—",
        () => this.scene.start(level.sceneKey),
        { width: 250, disabled: !unlocked, accent: level.accent },
      );
      art.setMask(
        this.make
          .graphics({ x: 0, y: 0 })
          .fillRoundedRect(x - 150, 140, 300, 170, 8)
          .createGeometryMask(),
      );
    });
    makeButton(
      this,
      640,
      635,
      lang === "th" ? "กลับเมนู" : "Main Menu",
      () => this.scene.start("MainMenuScene"),
      { width: 250 },
    );
  }
}
