import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import { saveStore } from "../storage/saveStore";
import { FONT_FAMILY, makeButton, makeTitle } from "../ui/components";

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super("SettingsScene");
  }

  create(): void {
    this.add.image(640, 360, "poster").setDisplaySize(1280, 720).setTint(0x7a7a8f);
    this.add.rectangle(640, 360, 1280, 720, 0x050715, 0.82);
    makeTitle(this, 640, 72, "ตั้งค่า • SETTINGS", 44);
    this.render();
  }

  private render(): void {
    this.children
      .getAll()
      .filter((child) => child.name === "settings-item")
      .forEach((child) => child.destroy());
    const settings = saveStore.get().settings;
    const rows: Array<{ label: string; value: string; change: () => void }> = [
      {
        label: "ภาษา • Language",
        value: settings.language === "th" ? "ไทย" : "English",
        change: () => saveStore.updateSettings({ language: settings.language === "th" ? "en" : "th" }),
      },
      {
        label: "คุณภาพภาพ • Quality",
        value: settings.quality.toUpperCase(),
        change: () => {
          const options = ["auto", "low", "medium", "high"] as const;
          const next = options[(options.indexOf(settings.quality) + 1) % options.length];
          saveStore.updateSettings({ quality: next });
        },
      },
      {
        label: "เสียงดนตรี • Music",
        value: `${Math.round(settings.musicVolume * 100)}%`,
        change: () => {
          const next = settings.musicVolume >= 1 ? 0 : settings.musicVolume + 0.25;
          saveStore.updateSettings({ musicVolume: next });
          audioDirector.syncSettings();
        },
      },
      {
        label: "เสียงเอฟเฟกต์ • SFX",
        value: `${Math.round(settings.sfxVolume * 100)}%`,
        change: () => {
          const next = settings.sfxVolume >= 1 ? 0 : settings.sfxVolume + 0.25;
          saveStore.updateSettings({ sfxVolume: next });
          audioDirector.syncSettings();
        },
      },
      {
        label: "สั่นหน้าจอ • Screen shake",
        value: settings.screenShake ? "ON" : "OFF",
        change: () => saveStore.updateSettings({ screenShake: !settings.screenShake }),
      },
      {
        label: "ปิดเสียงทั้งหมด • Mute",
        value: settings.muted ? "ON" : "OFF",
        change: () => {
          saveStore.updateSettings({ muted: !settings.muted });
          audioDirector.syncSettings();
        },
      },
      {
        label: "ความโปร่งใสปุ่มสัมผัส",
        value: `${Math.round(settings.touchOpacity * 100)}%`,
        change: () => {
          const next = settings.touchOpacity >= 0.9 ? 0.5 : settings.touchOpacity + 0.1;
          saveStore.updateSettings({ touchOpacity: Math.round(next * 10) / 10 });
        },
      },
    ];

    rows.forEach((row, index) => {
      const y = 145 + index * 62;
      const bg = this.add.rectangle(640, y, 720, 51, 0x10162a, 0.92).setStrokeStyle(1, 0x526889, 0.7);
      const label = this.add
        .text(310, y, row.label, {
          fontFamily: FONT_FAMILY,
          fontSize: "18px",
          color: "#dbe5f3",
        })
        .setOrigin(0, 0.5);
      const button = makeButton(this, 880, y, row.value, () => {
        row.change();
        this.render();
      }, { width: 210 });
      bg.name = label.name = button.name = "settings-item";
    });

    const clear = makeButton(this, 500, 605, "ลบข้อมูลการเล่น", () => {
      const text = clear.getAt(1) as Phaser.GameObjects.Text;
      if (text.text.includes("ยืนยัน")) {
        saveStore.clear();
        this.scene.restart();
      } else text.setText("กดอีกครั้งเพื่อยืนยัน");
    }, { width: 330 });
    clear.name = "settings-item";
    const back = makeButton(this, 780, 660, "กลับเมนู", () => this.scene.start("MainMenuScene"), {
      width: 250,
    });
    back.name = "settings-item";
  }
}
