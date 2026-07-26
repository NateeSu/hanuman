import Phaser from "phaser";

export const FONT_FAMILY = '"Noto Sans Thai", "Leelawadee UI", Tahoma, sans-serif';

export const makeTitle = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  size = 54,
): Phaser.GameObjects.Text =>
  scene.add
    .text(x, y, text, {
      fontFamily: FONT_FAMILY,
      fontSize: `${size}px`,
      fontStyle: "bold",
      color: "#fff7dd",
      stroke: "#080914",
      strokeThickness: 8,
      align: "center",
    })
    .setOrigin(0.5);

export const makeButton = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  options: { width?: number; disabled?: boolean; accent?: number } = {},
): Phaser.GameObjects.Container => {
  const width = options.width ?? 350;
  const accent = options.accent ?? 0xd9ae5a;
  const background = scene.add.graphics();
  const draw = (hovered: boolean) => {
    background.clear();
    background.fillStyle(options.disabled ? 0x161826 : hovered ? 0x1d4662 : 0x11162a, 0.94);
    background.fillRoundedRect(-width / 2, -31, width, 62, 12);
    background.lineStyle(2, options.disabled ? 0x50566c : accent, hovered ? 1 : 0.72);
    background.strokeRoundedRect(-width / 2, -31, width, 62, 12);
    if (hovered && !options.disabled) {
      background.lineStyle(1, 0x7aeaff, 0.45);
      background.strokeRoundedRect(-width / 2 + 5, -26, width - 10, 52, 9);
    }
  };
  draw(false);
  const text = scene.add
    .text(0, 1, label, {
      fontFamily: FONT_FAMILY,
      fontSize: "24px",
      fontStyle: "bold",
      color: options.disabled ? "#6f768d" : "#fff7dd",
    })
    .setOrigin(0.5);
  const hit = scene.add.rectangle(0, 0, width, 64, 0x000000, 0.001);
  const container = scene.add.container(x, y, [background, text, hit]);
  if (!options.disabled) {
    hit
      .setInteractive({ useHandCursor: true })
      .on("pointerover", () => draw(true))
      .on("pointerout", () => draw(false))
      .on("pointerdown", () => container.setScale(0.97))
      .on("pointerup", () => {
        container.setScale(1);
        onClick();
      });
  }
  return container;
};

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
