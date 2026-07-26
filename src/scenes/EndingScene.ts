import Phaser from "phaser";
import { saveStore } from "../storage/saveStore";
import { FONT_FAMILY, makeButton, makeTitle } from "../ui/components";

export class EndingScene extends Phaser.Scene {
  constructor() {
    super("EndingScene");
  }

  create(): void {
    const lang = saveStore.get().settings.language;
    const image = this.add.image(640, 360, "poster").setDisplaySize(1280, 720).setTint(0xd9e7ff);
    image.setFlipX(true);
    this.add.rectangle(640, 360, 1280, 720, 0x060714, 0.42);
    const glow = this.add.circle(640, 330, 230, 0xf1ca68, 0.14);
    this.tweens.add({ targets: glow, scale: 1.15, alpha: 0.06, duration: 1700, yoyo: true, repeat: -1 });
    makeTitle(this, 640, 105, lang === "th" ? "ชัยชนะแห่งวายุ" : "Victory of the Wind", 58);
    this.add
      .text(
        640,
        260,
        lang === "th"
          ? "ดวงใจไมยราพถูกทำลาย พระรามพ้นจากมนตร์แห่งนครบาดาล\nหนุมานนำพระองค์กลับสู่กองทัพ ก่อนรุ่งอรุณจะมาถึง"
          : "Maiyarap's hidden heart is destroyed and Rama is freed.\nHanuman carries him back to the army before dawn.",
        {
          fontFamily: FONT_FAMILY,
          fontSize: "25px",
          color: "#f2f1e9",
          align: "center",
          lineSpacing: 12,
          wordWrap: { width: 830 },
          stroke: "#070817",
          strokeThickness: 5,
        },
      )
      .setOrigin(0.5);
    const save = saveStore.get();
    const total = Object.values(save.levelStats).reduce((sum, stats) => sum + stats.collectibles.length, 0);
    this.add
      .text(640, 415, `${lang === "th" ? "ตราพระรามที่ค้นพบ" : "Rama Seals Found"}  ${total}/9`, {
        fontFamily: FONT_FAMILY,
        fontSize: "22px",
        fontStyle: "bold",
        color: "#ffe399",
        backgroundColor: "#090c1bcc",
        padding: { x: 20, y: 12 },
      })
      .setOrigin(0.5);
    makeButton(this, 640, 575, lang === "th" ? "กลับสู่เมนูหลัก" : "Return to Main Menu", () =>
      this.scene.start("MainMenuScene"),
    );
  }
}
