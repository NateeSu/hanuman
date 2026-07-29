import Phaser from "phaser";
import "./styles/game.css";
import { BootScene } from "./scenes/BootScene";
import { PreloadScene } from "./scenes/PreloadScene";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { LevelSelectScene } from "./scenes/LevelSelectScene";
import { SettingsScene } from "./scenes/SettingsScene";
import {
  Level01Scene,
  Level02Scene,
  Level03Scene,
  Level04Scene,
  Level05Scene,
  Level06Scene,
  Level07Scene,
} from "./scenes/LevelScenes";
import { PauseScene } from "./scenes/PauseScene";
import { ResultScene } from "./scenes/ResultScene";
import { EndingScene } from "./scenes/EndingScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 1280,
  height: 720,
  backgroundColor: "#070817",
  render: {
    antialias: true,
    roundPixels: true,
    powerPreference: "high-performance",
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1280,
    height: 720,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 1650 },
      debug: false,
    },
  },
  input: {
    activePointers: 6,
  },
  scene: [
    BootScene,
    PreloadScene,
    MainMenuScene,
    LevelSelectScene,
    SettingsScene,
    Level01Scene,
    Level02Scene,
    Level03Scene,
    Level04Scene,
    Level05Scene,
    Level06Scene,
    Level07Scene,
    PauseScene,
    ResultScene,
    EndingScene,
  ],
};

try {
  const game = new Phaser.Game(config);
  const pauseActiveGameplay = () => {
    const active = game.scene
      .getScenes(true)
      .find((scene) => /^Level0[1-7]Scene$/.test(scene.scene.key));
    if (active && !active.scene.isPaused()) {
      active.scene.pause();
      game.scene.start("PauseScene", { owner: active.scene.key });
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseActiveGameplay();
  });
  window.addEventListener("orientationchange", () => {
    if (window.matchMedia("(orientation: portrait)").matches) pauseActiveGameplay();
  });
} catch (error) {
  const panel = document.querySelector<HTMLElement>("#fatal-error");
  const message = document.querySelector<HTMLElement>("#fatal-error-message");
  if (panel && message) {
    message.textContent =
      error instanceof Error ? error.message : "เบราว์เซอร์นี้ไม่รองรับ Canvas/WebGL";
    panel.hidden = false;
  }
}
