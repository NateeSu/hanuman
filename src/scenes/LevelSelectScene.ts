import Phaser from "phaser";
import { LEVELS } from "../data/levels";
import { saveStore } from "../storage/saveStore";
import { FONT_FAMILY, makeButton, makeTitle } from "../ui/components";

const CARD_WIDTH = 270;
const CARD_HEIGHT = 214;

const cardPosition = (
  index: number,
): {
  x: number;
  y: number;
} => {
  if (index < 4) return { x: 170 + index * 313, y: 244 };
  return { x: 326 + (index - 4) * 314, y: 490 };
};

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super("LevelSelectScene");
  }

  create(): void {
    const save = saveStore.get();
    const lang = save.settings.language;
    this.add
      .image(640, 360, "level-07")
      .setDisplaySize(1280, 720)
      .setTint(0x6f789d);
    this.add.rectangle(640, 360, 1280, 720, 0x050716, 0.76);
    makeTitle(
      this,
      640,
      54,
      lang === "th" ? "เลือกเส้นทางศึก" : "Choose Your Battle",
      42,
    );

    LEVELS.forEach((level, index) => {
      const { x, y } = cardPosition(index);
      const unlocked = level.id <= save.unlockedLevel;
      const completed = save.completedLevels.includes(level.id);
      this.add
        .rectangle(x, y, CARD_WIDTH, CARD_HEIGHT, 0x10172c, 0.95)
        .setStrokeStyle(
          2,
          unlocked ? level.accent : 0x41465b,
          unlocked ? 0.92 : 0.5,
        );
      const art = this.add
        .image(x, y - 55, level.background)
        .setDisplaySize(244, 100)
        .setTint(unlocked ? 0xffffff : 0x424655);
      const maskShape = this.make
        .graphics({ x: 0, y: 0 })
        .fillRoundedRect(x - 122, y - 105, 244, 100, 7);
      art.setMask(maskShape.createGeometryMask());

      this.add
        .text(
          x,
          y + 10,
          `${level.id.toString().padStart(2, "0")} · ${level.title[lang]}`,
          {
            fontFamily: FONT_FAMILY,
            fontSize: "17px",
            fontStyle: "bold",
            color: unlocked ? "#fff4d1" : "#777d91",
            align: "center",
            wordWrap: { width: 242 },
          },
        )
        .setOrigin(0.5);
      this.add
        .text(
          x,
          y + 43,
          unlocked
            ? level.subtitle[lang]
            : lang === "th"
              ? "ยังไม่ปลดล็อก"
              : "Locked",
          {
            fontFamily: FONT_FAMILY,
            fontSize: "12px",
            color: unlocked ? "#a8c6d8" : "#6d7285",
            align: "center",
            wordWrap: { width: 238 },
          },
        )
        .setOrigin(0.5);
      if (completed) {
        this.add
          .text(x + 111, y - 92, "✓", {
            fontFamily: FONT_FAMILY,
            fontSize: "23px",
            fontStyle: "bold",
            color: "#72f2c5",
            stroke: "#07141b",
            strokeThickness: 5,
          })
          .setOrigin(0.5);
      }
      makeButton(
        this,
        x,
        y + 82,
        unlocked ? (lang === "th" ? "เริ่มด่าน" : "Begin") : "—",
        () => this.scene.start("StoryScene", { levelId: level.id }),
        {
          width: 198,
          height: 42,
          disabled: !unlocked,
          accent: level.accent,
        },
      );
    });

    makeButton(
      this,
      640,
      674,
      lang === "th" ? "กลับเมนู" : "Main Menu",
      () => this.scene.start("MainMenuScene"),
      { width: 240, height: 44 },
    );
  }
}
