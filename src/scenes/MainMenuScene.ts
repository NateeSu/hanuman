import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import { t } from "../data/i18n";
import { saveStore } from "../storage/saveStore";
import { FONT_FAMILY, makeButton } from "../ui/components";

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("MainMenuScene");
  }

  create(): void {
    document.querySelector<HTMLElement>("#touch-controls")!.hidden = true;
    const save = saveStore.get();
    const lang = save.settings.language;
    const poster = this.add.image(640, 360, "poster").setDisplaySize(1280, 720);
    poster.setCrop(0, 0, poster.width * 0.66, poster.height);
    poster.setOrigin(0.28, 0.5).setX(350);
    this.add.rectangle(640, 360, 1280, 720, 0x040611, 0.32);
    const veil = this.add.graphics();
    veil.fillGradientStyle(0x070817, 0x070817, 0x070817, 0x070817, 0.04, 0.94, 0.04, 0.94);
    veil.fillRect(390, 0, 890, 720);

    this.add
      .text(805, 72, "หนุมาน", {
        fontFamily: FONT_FAMILY,
        fontSize: "72px",
        fontStyle: "bold",
        color: "#fff6dc",
        stroke: "#090710",
        strokeThickness: 9,
      })
      .setOrigin(0.5);
    this.add
      .text(805, 145, "ศึกไมยราพ", {
        fontFamily: FONT_FAMILY,
        fontSize: "37px",
        fontStyle: "bold",
        color: "#e6bb60",
        stroke: "#090710",
        strokeThickness: 6,
      })
      .setOrigin(0.5);
    this.add
      .text(805, 192, "HANUMAN · BATTLE OF MAIYARAP", {
        fontFamily: FONT_FAMILY,
        fontSize: "13px",
        color: "#91b7ca",
        letterSpacing: 3,
      })
      .setOrigin(0.5);

    makeButton(this, 805, 286, t(lang, "newGame"), () => {
      audioDirector.unlock();
      this.scene.start("Level01Scene");
    });
    const hasProgress = save.completedLevels.length > 0 || !!save.latestCheckpoint;
    makeButton(
      this,
      805,
      362,
      t(lang, "continue"),
      () => {
        audioDirector.unlock();
        const levelId = save.latestCheckpoint?.levelId ?? save.unlockedLevel;
        this.scene.start(`Level0${levelId}Scene`);
      },
      { disabled: !hasProgress },
    );
    makeButton(this, 805, 438, t(lang, "levelSelect"), () =>
      this.scene.start("LevelSelectScene"),
    );
    makeButton(this, 805, 514, t(lang, "settings"), () =>
      this.scene.start("SettingsScene"),
    );
    makeButton(this, 805, 590, t(lang, "credits"), () => this.showCredits(), { width: 350 });

    this.add
      .text(805, 679, t(lang, "controls"), {
        fontFamily: FONT_FAMILY,
        fontSize: "14px",
        color: "#8f9db8",
      })
      .setOrigin(0.5);
  }

  private showCredits(): void {
    const blocker = this.add.rectangle(640, 360, 1280, 720, 0x03040b, 0.9).setInteractive();
    const panel = this.add.rectangle(640, 360, 680, 430, 0x10152a, 0.98).setStrokeStyle(2, 0xd9ae5a);
    const text = this.add
      .text(
        640,
        335,
        "สร้างขึ้นใหม่สำหรับโครงการนี้\n\nภาพหลัก ตัวละคร ฉาก และวัตถุทั้งหมด\nสร้างด้วย OpenAI Image Generation\n\nดนตรีและเอฟเฟกต์เสียงสังเคราะห์แบบ procedural\nไม่มี asset หรือเสียงบุคคลที่สาม\n\nอ้างอิงวรรณคดีไทย: รามเกียรติ์ ตอนศึกไมยราพ",
        {
          fontFamily: FONT_FAMILY,
          fontSize: "22px",
          color: "#e7edf8",
          align: "center",
          lineSpacing: 10,
        },
      )
      .setOrigin(0.5);
    const close = makeButton(this, 640, 540, "ปิด • Close", () => {
      blocker.destroy();
      panel.destroy();
      text.destroy();
      close.destroy();
    }, { width: 240 });
  }
}
