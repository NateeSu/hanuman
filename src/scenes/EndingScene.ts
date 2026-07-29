import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import { LEVEL_COUNT } from "../data/levels";
import type { Language } from "../data/types";
import { saveStore } from "../storage/saveStore";
import { FONT_FAMILY, makeButton } from "../ui/components";

interface EndingSlide {
  background: string;
  primaryTexture: string;
  secondaryTexture: string;
  title: Record<Language, string>;
  body: Record<Language, string>;
  note: Record<Language, string>;
  accent: number;
}

const ENDING_SLIDES: EndingSlide[] = [
  {
    background: "level-07",
    primaryTexture: "hanuman-victory",
    secondaryTexture: "maiyarap",
    title: { th: "ดวงใจแห่งอสูรดับลง", en: "The Demon's Heart Falls Silent" },
    body: {
      th: "หนุมานค้นพบดวงใจที่ไมยราพซ่อนไว้นอกกาย และทำลายมันลงด้วยตรีศูลวายุ\nเจ้าเมืองบาดาลจึงสิ้นฤทธิ์ มนตร์มืดที่ปกคลุมพระนครสลายไป",
      en: "Hanuman finds the heart Maiyarap hid outside his body and shatters it with the wind trishula.\nThe underworld king loses his power, and the dark spell over the city dissolves.",
    },
    note: {
      th: "ชัยชนะเกิดจากการรู้ความลับของศัตรู ก่อนใช้พลังในจังหวะที่ถูกต้อง",
      en: "Victory comes from learning the enemy's secret, then using strength at the right moment.",
    },
    accent: 0xf4c45f,
  },
  {
    background: "level-06",
    primaryTexture: "hanuman-idle",
    secondaryTexture: "rama",
    title: { th: "พระรามพ้นจากนครบาดาล", en: "Rama Leaves the Underworld" },
    body: {
      th: "เมื่อภัยสิ้นสุด หนุมานถวายอารักขาพระรามออกจากดงตาล ผ่านประตูบาดาล\nและนำพระองค์กลับขึ้นสู่กองทัพวานรที่กำลังฟื้นจากมนตร์นิทรา",
      en: "With the danger ended, Hanuman escorts Rama from the toddy grove, through the underworld gate,\nand back to the vanara army as it awakens from the sleeping spell.",
    },
    note: {
      th: "ภารกิจของหนุมานไม่จบเพียงปราบศัตรู แต่ต้องรักษาคำสัตย์และพาพระรามกลับอย่างปลอดภัย",
      en: "Hanuman's duty is more than defeating an enemy: he must keep his vow and bring Rama home safely.",
    },
    accent: 0xb7ff63,
  },
  {
    background: "level-01",
    primaryTexture: "hanuman-victory",
    secondaryTexture: "rama",
    title: { th: "รุ่งอรุณแห่งความภักดี", en: "A Dawn of Devotion" },
    body: {
      th: "ก่อนแสงแรกแตะขอบฟ้า พระรามกลับสู่กองทัพโดยปลอดภัย\nวีรกรรมครั้งนี้จึงเป็นเรื่องของความกล้าหาญ ปัญญา และความภักดีที่ไม่หวั่นไหว",
      en: "Before the first light touches the horizon, Rama returns safely to his army.\nThe adventure endures as a tale of courage, wisdom, and unwavering devotion.",
    },
    note: {
      th: "จบบทวรรณคดี “ศึกไมยราพ” — หนุมานชนะเพราะหัวใจที่มั่นคงพอ ๆ กับพละกำลัง",
      en: "The Battle of Maiyarap ends—Hanuman prevails through steadfast heart as much as physical power.",
    },
    accent: 0x69dfff,
  },
];

export class EndingScene extends Phaser.Scene {
  private slideIndex = 0;
  private slideRoot?: Phaser.GameObjects.Container;
  private transitioning = false;
  private readonly advanceHandler = () => this.advance();

  constructor() {
    super("EndingScene");
  }

  create(): void {
    document.querySelector<HTMLElement>("#touch-controls")!.hidden = true;
    this.slideIndex = 0;
    this.transitioning = false;
    this.renderSlide();
    this.input.keyboard?.on("keydown-ENTER", this.advanceHandler);
    this.input.keyboard?.on("keydown-SPACE", this.advanceHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.keyboard?.off("keydown-ENTER", this.advanceHandler);
      this.input.keyboard?.off("keydown-SPACE", this.advanceHandler);
    });
    this.cameras.main.fadeIn(450, 3, 5, 15);
  }

  private renderSlide(): void {
    this.slideRoot?.destroy(true);
    const language = saveStore.get().settings.language;
    const slide = ENDING_SLIDES[this.slideIndex];
    const root = this.add.container(0, 0).setAlpha(0);
    this.slideRoot = root;

    const backdrop = this.add
      .image(640, 360, slide.background)
      .setDisplaySize(1280, 720)
      .setTint(this.slideIndex === 2 ? 0xe8ceaa : 0xb8c8e7);
    const shade = this.add.rectangle(640, 360, 1280, 720, 0x040716, 0.42);
    const veil = this.add.graphics();
    veil.fillGradientStyle(0x050817, 0x050817, 0x050817, 0x050817, 0.92, 0.12, 0.92, 0.18);
    veil.fillRect(0, 0, 1280, 720);
    root.add([backdrop, shade, veil]);

    const glow = this.add
      .ellipse(970, 352, 520, 550, slide.accent, 0.12)
      .setBlendMode(Phaser.BlendModes.ADD);
    const secondary = this.add
      .image(1070, 370, slide.secondaryTexture)
      .setDisplaySize(320, 430)
      .setTint(this.slideIndex === 0 ? 0x8790a7 : 0xe9f2ff)
      .setAlpha(this.slideIndex === 0 ? 0.55 : 0.9);
    const primary = this.add
      .image(815, 445, slide.primaryTexture)
      .setDisplaySize(270, 390)
      .setOrigin(0.5, 0.62);
    root.add([glow, secondary, primary]);
    this.tweens.add({
      targets: glow,
      alpha: 0.22,
      scale: 1.06,
      duration: 1700,
      yoyo: true,
      repeat: -1,
    });

    const frame = this.add.graphics();
    frame.lineStyle(2, 0xd9ae5a, 0.64);
    frame.strokeRect(28, 26, 1224, 668);
    frame.lineStyle(1, slide.accent, 0.3);
    frame.strokeRect(36, 34, 1208, 652);
    frame.lineStyle(3, 0xd9ae5a, 0.8);
    frame.lineBetween(52, 52, 118, 52);
    frame.lineBetween(52, 52, 52, 118);
    frame.lineBetween(1228, 52, 1162, 52);
    frame.lineBetween(1228, 52, 1228, 118);
    root.add(frame);

    const chapter = this.add
      .text(
        82,
        72,
        language === "th"
          ? `บทส่งท้าย  ${this.slideIndex + 1}/${ENDING_SLIDES.length}`
          : `EPILOGUE  ${this.slideIndex + 1}/${ENDING_SLIDES.length}`,
        {
          fontFamily: FONT_FAMILY,
          fontSize: "16px",
          fontStyle: "bold",
          color: `#${slide.accent.toString(16).padStart(6, "0")}`,
          letterSpacing: language === "th" ? 1 : 3,
        },
      );
    const title = this.add
      .text(80, 116, slide.title[language], {
        fontFamily: FONT_FAMILY,
        fontSize: language === "th" ? "51px" : "44px",
        fontStyle: "bold",
        color: "#fff3d2",
        stroke: "#050711",
        strokeThickness: 7,
        wordWrap: { width: 640 },
      });
    const body = this.add
      .text(82, 238, slide.body[language], {
        fontFamily: FONT_FAMILY,
        fontSize: language === "th" ? "22px" : "19px",
        color: "#edf2fa",
        lineSpacing: 12,
        wordWrap: { width: 610 },
      });
    const noteLine = this.add.rectangle(82, 418, 575, 2, slide.accent, 0.75).setOrigin(0, 0.5);
    const noteLabel = this.add
      .text(82, 440, language === "th" ? "ความหมายของเรื่อง" : "THE STORY'S MEANING", {
        fontFamily: FONT_FAMILY,
        fontSize: "14px",
        fontStyle: "bold",
        color: `#${slide.accent.toString(16).padStart(6, "0")}`,
        letterSpacing: language === "th" ? 1 : 2,
      });
    const note = this.add
      .text(82, 471, slide.note[language], {
        fontFamily: FONT_FAMILY,
        fontSize: language === "th" ? "18px" : "17px",
        color: "#decfa8",
        lineSpacing: 7,
        wordWrap: { width: 585 },
      });
    root.add([chapter, title, body, noteLine, noteLabel, note]);

    if (this.slideIndex === ENDING_SLIDES.length - 1) {
      const save = saveStore.get();
      const total = Object.values(save.levelStats).reduce(
        (sum, stats) => sum + stats.collectibles.length,
        0,
      );
      const seals = this.add
        .text(
          82,
          566,
          `${language === "th" ? "ตราพระรามที่ค้นพบ" : "RAMA SEALS FOUND"}  ${total}/${LEVEL_COUNT * 3}`,
          {
            fontFamily: FONT_FAMILY,
            fontSize: "16px",
            fontStyle: "bold",
            color: "#ffe399",
            backgroundColor: "#070b19cc",
            padding: { x: 16, y: 10 },
          },
        );
      root.add(seals);
    }

    const isLast = this.slideIndex === ENDING_SLIDES.length - 1;
    const next = makeButton(
      this,
      1065,
      635,
      isLast
        ? language === "th"
          ? "กลับสู่เมนูหลัก"
          : "RETURN TO MAIN MENU"
        : language === "th"
          ? "เรื่องราวถัดไป  ›"
          : "CONTINUE  ›",
      this.advanceHandler,
      { width: 340, height: 58, fontSize: 20, accent: slide.accent },
    );
    root.add(next);

    for (let index = 0; index < ENDING_SLIDES.length; index += 1) {
      const dot = this.add
        .circle(
          78 + index * 28,
          665,
          index === this.slideIndex ? 7 : 4,
          index === this.slideIndex ? slide.accent : 0x8291a5,
          index === this.slideIndex ? 1 : 0.55,
        )
        .setStrokeStyle(index === this.slideIndex ? 2 : 0, 0xffe2a0, 0.85);
      root.add(dot);
    }

    this.tweens.add({
      targets: root,
      alpha: 1,
      duration: 520,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.transitioning = false;
      },
    });
    this.tweens.add({
      targets: [primary, secondary],
      y: "-=8",
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  private advance(): void {
    if (this.transitioning) return;
    if (this.slideIndex === ENDING_SLIDES.length - 1) {
      this.transitioning = true;
      this.cameras.main.fadeOut(360, 3, 5, 15);
      this.time.delayedCall(380, () => this.scene.start("MainMenuScene"));
      return;
    }
    this.transitioning = true;
    audioDirector.play("checkpoint");
    this.tweens.add({
      targets: this.slideRoot,
      alpha: 0,
      x: -18,
      duration: 260,
      ease: "Quad.easeIn",
      onComplete: () => {
        this.slideIndex += 1;
        this.renderSlide();
      },
    });
  }
}
