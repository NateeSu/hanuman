import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import { Boss } from "../entities/Boss";
import { Enemy, type EnemyKind } from "../entities/Enemy";
import {
  HostileProjectile,
  type HostileProjectileKind,
  type HostileProjectilePayload,
} from "../entities/HostileProjectile";
import { Player } from "../entities/Player";
import { levelById } from "../data/levels";
import {
  getTerrainPlatforms,
  getTerrainSurfaceAt,
  getTerrainSurfaceY,
} from "../data/terrain";
import type { LevelDefinition } from "../data/types";
import { saveStore } from "../storage/saveStore";
import { BOSS_ARENA, resolveRespawnX } from "../systems/bossArena";
import {
  getHazardPresentation,
  type HazardPresentation,
  type HazardTexture,
} from "../systems/hazardPresentation";
import { touchInput } from "../systems/touchInput";
import {
  TRISHULA_RADIUS_X,
  TRISHULA_RADIUS_Y,
  getTrishulaPosition,
  type TrishulaCastOrigin,
} from "../systems/trishulaUltimate";
import { FONT_FAMILY } from "../ui/components";

const WORLD_WIDTH = 3840;
interface TrishulaRuntime {
  sprite: Phaser.GameObjects.Image;
  aura: Phaser.GameObjects.Image;
  sigil: Phaser.GameObjects.Ellipse;
  cast: TrishulaCastOrigin;
  startedAt: number;
  lastTrailAt: number;
  lastRelicHitAt: number;
  hitTargets: Set<Enemy | Boss>;
}

export abstract class BaseLevelScene extends Phaser.Scene {
  protected abstract readonly levelId: 1 | 2 | 3;
  private level!: LevelDefinition;
  private player!: Player;
  private boss?: Boss;
  private enemies: Enemy[] = [];
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private startTime = 0;
  private gameplayStartsAt = 0;
  private collected = new Set<string>();
  private checkpointX = 140;
  private bossStarted = false;
  private bossDefeated = false;
  private completing = false;
  private hpBar!: Phaser.GameObjects.Rectangle;
  private windBar!: Phaser.GameObjects.Rectangle;
  private collectibleText!: Phaser.GameObjects.Text;
  private bossBarBg!: Phaser.GameObjects.Rectangle;
  private bossBar!: Phaser.GameObjects.Rectangle;
  private bossLabel!: Phaser.GameObjects.Text;
  private instruction!: Phaser.GameObjects.Text;
  private heartSeals: Phaser.GameObjects.Image[] = [];
  private heart?: Phaser.GameObjects.Image;
  private heartHits = 0;
  private hostileProjectiles = new Set<HostileProjectile>();
  private trishula?: TrishulaRuntime;
  private readonly pauseHandler = () => this.pauseGame();

  create(): void {
    this.level = levelById(this.levelId);
    this.startTime = this.time.now;
    this.gameplayStartsAt = this.time.now + 3300;
    const save = saveStore.get();
    const savedCollectibles = save.levelStats[String(this.levelId)]?.collectibles ?? [];
    this.collected = new Set(savedCollectibles);
    const checkpoint = save.latestCheckpoint;
    this.checkpointX =
      checkpoint?.levelId === this.levelId
        ? checkpoint.checkpointId === "cp-2"
          ? 2470
          : 1330
        : 140;
    if (import.meta.env.DEV) {
      const debugSpawnX = Number(
        new URLSearchParams(window.location.search).get("spawnX"),
      );
      if (Number.isFinite(debugSpawnX) && debugSpawnX >= 40 && debugSpawnX <= WORLD_WIDTH - 40) {
        this.checkpointX = debugSpawnX;
      }
    }

    document.querySelector<HTMLElement>("#touch-controls")!.hidden = false;
    document.querySelector<HTMLElement>("#touch-controls")!.style.opacity = String(
      save.settings.touchOpacity,
    );
    touchInput.reset();
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, 720);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 720);
    this.createWorldArt();
    this.createTerrain();
    this.player = new Player(this, this.checkpointX, this.getActorSpawnY(this.checkpointX));
    this.physics.add.collider(this.player, this.platforms);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.1);
    this.cameras.main.setDeadzone(240, 120);
    this.cameras.main.setFollowOffset(-80, 20);
    this.spawnCollectibles();
    this.spawnCheckpoints();
    this.spawnHazards();
    this.spawnEnemies();
    if (this.levelId === 3) this.spawnHeartSequence();
    this.createExit();
    this.createHud();
    this.bindEvents();
    this.showStory();

    const keyboard = this.input.keyboard;
    keyboard?.on("keydown-ESC", this.pauseHandler);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      keyboard?.off("keydown-ESC", this.pauseHandler);
      this.clearHostileProjectiles();
      document.querySelector<HTMLElement>("#touch-controls")!.hidden = true;
    });
  }

  update(time: number): void {
    if (!this.player?.active || this.completing) return;
    if (time < this.gameplayStartsAt) return;
    this.player.update(time);
    this.enemies.forEach((enemy) => enemy.update(time));
    this.boss?.update(time);
    this.updateHostileProjectiles(time);
    this.updateTrishulaUltimate(time);
    if (!this.bossStarted && this.player.x > 3190 && (this.levelId < 3 || this.heartHits >= 3)) {
      this.startBoss();
    }
    if (this.player.y > 710) this.respawn();
  }

  private createWorldArt(): void {
    for (let segment = 0; segment < 3; segment += 1) {
      this.add
        .image(640 + segment * 1280, 360, this.level.background)
        .setDisplaySize(1280, 720)
        .setDepth(-20);
    }
    const topShade = this.add.graphics().setDepth(-10);
    topShade.fillGradientStyle(0x03040c, 0x03040c, 0x03040c, 0x03040c, 0.3, 0.3, 0, 0);
    topShade.fillRect(0, 0, WORLD_WIDTH, 180);
    const quality = saveStore.get().settings.quality;
    if (quality !== "low") {
      for (let index = 0; index < 24; index += 1) {
        const mote = this.add
          .circle(Phaser.Math.Between(0, WORLD_WIDTH), Phaser.Math.Between(100, 610), Phaser.Math.Between(1, 3), this.level.accent, 0.35)
          .setDepth(-5);
        this.tweens.add({
          targets: mote,
          y: mote.y - Phaser.Math.Between(45, 120),
          alpha: 0.05,
          duration: Phaser.Math.Between(2200, 4400),
          yoyo: true,
          repeat: -1,
          delay: Phaser.Math.Between(0, 1800),
        });
      }
    }
  }

  private createTerrain(): void {
    this.platforms = this.physics.add.staticGroup();
    const showDebugCollision =
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).get("debugCollision") === "1";
    getTerrainPlatforms(this.levelId).forEach(({ x, y, width, height }) => {
      const platform = this.add.rectangle(
        x + width / 2,
        y + height / 2,
        width,
        height,
        showDebugCollision ? 0x4dff91 : 0x000000,
        showDebugCollision ? 0.2 : 0.001,
      );
      if (showDebugCollision) platform.setStrokeStyle(2, 0x8dffb5, 0.95).setDepth(45);
      this.platforms.add(platform);
      (platform.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
    });
  }

  private spawnEnemies(): void {
    const roster: Array<[number, EnemyKind]> = [
      [760, "yak-guard"],
      [1110, "yak-archer"],
      [1570, "bat-spirit"],
      [2040, "shadow-mage"],
      [2390, "yak-guard"],
      [2830, this.levelId === 1 ? "yak-archer" : "bat-spirit"],
    ];
    roster.forEach(([x, kind]) => {
      const surface = getTerrainSurfaceAt(this.levelId, x);
      const enemy = new Enemy(
        this,
        x,
        this.getActorSpawnY(x),
        kind,
        this.player,
        surface
          ? { left: surface.x, right: surface.x + surface.width }
          : undefined,
      );
      this.enemies.push(enemy);
      this.physics.add.collider(enemy, this.platforms);
    });
  }

  private spawnCollectibles(): void {
    [610, 1740, 2870].forEach((x, index) => {
      const id = `seal-${index + 1}`;
      if (this.collected.has(id)) return;
      const seal = this.physics.add.staticImage(
        x,
        this.getSurfaceY(x) - (index === 1 ? 150 : 125),
        "rama-seal",
      );
      seal.setScale(0.17).setDepth(15);
      this.tweens.add({
        targets: seal,
        y: seal.y - 14,
        angle: 4,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
      this.physics.add.overlap(this.player, seal, () => {
        if (!seal.active) return;
        this.collected.add(id);
        saveStore.collect(this.levelId, id);
        seal.disableBody(true, true);
        this.player.addWind(25);
        audioDirector.play("collect");
        this.collectibleText.setText(`${this.collected.size}/3`);
        this.flashMessage(this.levelId === 1 ? "ตราพระราม" : "RAMA SEAL", this.level.accent);
      });
    });
  }

  private spawnCheckpoints(): void {
    [
      [1300, "cp-1"],
      [2440, "cp-2"],
    ].forEach(([x, id]) => {
      const checkpointX = Number(x);
      const checkpoint = this.physics.add.staticImage(
        checkpointX,
        this.getSurfaceY(checkpointX) - 72,
        "checkpoint",
      );
      checkpoint.setScale(0.23).setDepth(14);
      this.physics.add.overlap(this.player, checkpoint, () => {
        const checkpointId = String(id);
        if (this.checkpointX === Number(x) + 30) return;
        this.checkpointX = Number(x) + 30;
        saveStore.setCheckpoint(this.levelId, checkpointId);
        checkpoint.setTint(0x9affff);
        this.player.healAndRestore();
        audioDirector.play("checkpoint");
        this.flashMessage("จุดพักวายุ • CHECKPOINT", 0x65f2ff);
      });
    });
  }

  private spawnHazards(): void {
    const positions =
      this.levelId === 1
        ? [930, 2200]
        : this.levelId === 2
          ? [880, 2180]
          : [980, 2220, 2860];
    positions.forEach((x, index) => {
      const texture: HazardTexture =
        this.levelId === 1 && index === 0 ? "sleep-mist" : "blade-trap";
      const presentation = getHazardPresentation(texture);
      const surfaceY = this.getSurfaceY(x);
      const hazard = this.physics.add.staticImage(
        x,
        surfaceY - presentation.displayHeight / 2,
        texture,
      );
      hazard
        .setDisplaySize(presentation.displayWidth, presentation.displayHeight)
        .setDepth(16)
        .refreshBody();
      (hazard.body as Phaser.Physics.Arcade.StaticBody).setSize(
        presentation.hitboxWidth,
        presentation.hitboxHeight,
        true,
      );
      this.createHazardTelegraph(x, surfaceY, texture, presentation);
      if (texture === "blade-trap") {
        this.tweens.add({ targets: hazard, angle: 360, duration: 2600, repeat: -1 });
      } else {
        this.tweens.add({ targets: hazard, alpha: 0.55, duration: 900, yoyo: true, repeat: -1 });
      }
      this.physics.add.overlap(this.player, hazard, () => {
        if (this.player.takeDamage(presentation.damage, hazard.x)) {
          this.hazardDamageVfx(presentation.damage, presentation.color);
        }
      });
    });
  }

  private createHazardTelegraph(
    x: number,
    surfaceY: number,
    texture: HazardTexture,
    presentation: HazardPresentation,
  ): void {
    const warning = this.add
      .ellipse(
        x,
        surfaceY - 7,
        presentation.telegraphWidth,
        presentation.telegraphHeight,
        presentation.color,
        0.18,
      )
      .setStrokeStyle(3, presentation.color, 0.88)
      .setDepth(14);
    const aura = this.add
      .image(
        x,
        surfaceY - presentation.displayHeight / 2,
        texture,
      )
      .setDisplaySize(
        presentation.displayWidth * 1.34,
        presentation.displayHeight * 1.34,
      )
      .setTint(presentation.color)
      .setAlpha(0.22)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(15);

    this.tweens.add({
      targets: warning,
      scaleX: 1.14,
      scaleY: 1.24,
      alpha: 0.34,
      duration: 760,
      ease: "Sine.easeInOut",
      yoyo: true,
      repeat: -1,
    });
    this.tweens.add({
      targets: aura,
      scaleX: aura.scaleX * 1.12,
      scaleY: aura.scaleY * 1.12,
      alpha: 0.08,
      angle: texture === "blade-trap" ? -360 : 0,
      duration: texture === "blade-trap" ? 3100 : 980,
      ease: "Sine.easeInOut",
      yoyo: texture !== "blade-trap",
      repeat: -1,
    });

    for (let index = 0; index < 5; index += 1) {
      const mote = this.add
        .circle(
          x + Phaser.Math.Between(-52, 52),
          surfaceY - Phaser.Math.Between(8, 42),
          Phaser.Math.Between(2, 5),
          presentation.color,
          0.72,
        )
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(17);
      this.tweens.add({
        targets: mote,
        y: mote.y - Phaser.Math.Between(48, 92),
        x: mote.x + Phaser.Math.Between(-18, 18),
        alpha: 0,
        scale: 0.25,
        duration: Phaser.Math.Between(920, 1480),
        delay: index * 190,
        repeat: -1,
      });
    }
  }

  private hazardDamageVfx(damage: number, color: number): void {
    const x = this.player.x;
    const y = this.player.y - 58;
    this.impactVfx(x, y, color);
    this.windVfx(x, y, color);
    const warningBanner = this.add
      .container(640, 166)
      .setScrollFactor(0)
      .setDepth(60);
    const warningPanel = this.add
      .rectangle(0, 0, 270, 50, 0x26050b, 0.9)
      .setStrokeStyle(2, color, 0.98);
    const damageText = this.add
      .text(0, 0, `อันตราย  -${damage} HP`, {
        fontFamily: FONT_FAMILY,
        fontSize: "24px",
        fontStyle: "bold",
        color: "#fff7df",
        stroke: "#260006",
        strokeThickness: 7,
      })
      .setOrigin(0.5);
    warningBanner.add([warningPanel, damageText]);
    this.tweens.add({
      targets: warningBanner,
      y: warningBanner.y - 28,
      alpha: 0,
      scale: 1.08,
      delay: 650,
      duration: 700,
      ease: "Quad.easeOut",
      onComplete: () => warningBanner.destroy(),
    });
    this.cameras.main.flash(90, 128, 12, 18, false);
  }

  private spawnHeartSequence(): void {
    [2740, 2920, 3090].forEach((x) => {
      const seal = this.add
        .image(x, this.getSurfaceY(x) - 58, "heart-seal")
        .setScale(0.2)
        .setDepth(16);
      this.heartSeals.push(seal);
      this.tweens.add({
        targets: seal,
        alpha: 0.58,
        duration: 760,
        yoyo: true,
        repeat: -1,
      });
    });
    this.heart = this.add
      .image(3190, this.getSurfaceY(3190) - 100, "heart-reliquary")
      .setScale(0.22)
      .setDepth(16);
    this.instruction = this.add
      .text(640, 570, "", {
        fontFamily: FONT_FAMILY,
        fontSize: "20px",
        fontStyle: "bold",
        color: "#effff0",
        backgroundColor: "#15120cdd",
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(60);
  }

  private createExit(): void {
    const exit = this.physics.add.staticImage(3720, this.getSurfaceY(3720) - 100, "exit-portal");
    exit.setScale(0.29).setDepth(15).setVisible(false);
    this.physics.add.overlap(this.player, exit, () => {
      if (this.bossDefeated) this.finishLevel();
    });
    this.events.on("reveal-exit", () => {
      exit.setVisible(true);
      this.tweens.add({ targets: exit, alpha: 0.65, duration: 700, yoyo: true, repeat: -1 });
    });
  }

  private createHud(): void {
    const lang = saveStore.get().settings.language;
    const panel = this.add.graphics().setScrollFactor(0).setDepth(50);
    panel.fillStyle(0x070a17, 0.82);
    panel.fillRoundedRect(22, 20, 390, 122, 12);
    panel.lineStyle(2, 0xd8ad58, 0.66);
    panel.strokeRoundedRect(22, 20, 390, 122, 12);
    this.add
      .text(42, 36, "HP", {
        fontFamily: FONT_FAMILY,
        fontSize: "15px",
        fontStyle: "bold",
        color: "#ffe1ae",
      })
      .setScrollFactor(0)
      .setDepth(52);
    this.add
      .text(42, 76, lang === "th" ? "วายุ" : "WIND", {
        fontFamily: FONT_FAMILY,
        fontSize: "14px",
        fontStyle: "bold",
        color: "#bcefff",
      })
      .setScrollFactor(0)
      .setDepth(52);
    this.add.rectangle(100, 48, 286, 18, 0x240e19, 0.9).setOrigin(0, 0.5).setScrollFactor(0).setDepth(51);
    this.hpBar = this.add.rectangle(100, 48, 286, 14, 0xe95e66, 1).setOrigin(0, 0.5).setScrollFactor(0).setDepth(52);
    this.add.rectangle(100, 87, 286, 12, 0x082330, 0.9).setOrigin(0, 0.5).setScrollFactor(0).setDepth(51);
    this.windBar = this.add.rectangle(100, 87, 200, 8, 0x57dff5, 1).setOrigin(0, 0.5).setScrollFactor(0).setDepth(52);
    this.add
      .image(69, 120, "trishula-ultimate")
      .setDisplaySize(70, 18)
      .setScrollFactor(0)
      .setDepth(52);
    this.add
      .text(112, 120, "K  ตรีศูลวายุ  •  35", {
        fontFamily: FONT_FAMILY,
        fontSize: "14px",
        fontStyle: "bold",
        color: "#ffe09a",
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(52);
    this.add.image(450, 56, "rama-seal").setScale(0.085).setScrollFactor(0).setDepth(52);
    this.collectibleText = this.add
      .text(490, 56, `${this.collected.size}/3`, {
        fontFamily: FONT_FAMILY,
        fontSize: "20px",
        fontStyle: "bold",
        color: "#ffe29d",
      })
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(52);

    const pause = this.add
      .text(1232, 45, "Ⅱ", {
        fontFamily: FONT_FAMILY,
        fontSize: "30px",
        fontStyle: "bold",
        color: "#fff1ce",
        backgroundColor: "#10172bdd",
        padding: { x: 17, y: 9 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(55)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => this.pauseGame());
    pause.setShadow(0, 2, "#000", 5);

    this.bossBarBg = this.add
      .rectangle(640, 45, 490, 18, 0x230a12, 0.92)
      .setScrollFactor(0)
      .setDepth(51)
      .setVisible(false);
    this.bossBar = this.add
      .rectangle(395, 45, 490, 12, 0xd54b5e, 1)
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(52)
      .setVisible(false);
    this.bossLabel = this.add
      .text(640, 18, this.level.bossName[lang], {
        fontFamily: FONT_FAMILY,
        fontSize: "15px",
        fontStyle: "bold",
        color: "#ffe6b2",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(52)
      .setVisible(false);

    if (this.levelId !== 3) {
      this.instruction = this.add
        .text(640, 660, "", {
          fontFamily: FONT_FAMILY,
          fontSize: "18px",
          color: "#dbeeff",
          backgroundColor: "#060916cc",
          padding: { x: 18, y: 9 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(55);
    }
  }

  private bindEvents(): void {
    this.events.on("player-stats", (stats: { health: number; wind: number }) => {
      this.hpBar.width = 286 * (stats.health / 100);
      this.windBar.width = 286 * (stats.wind / 100);
    });
    this.events.on("player-attack", (x: number, y: number, damage: number, skill: boolean) => {
      const range = new Phaser.Geom.Rectangle(x - (skill ? 170 : 85), y - 100, skill ? 340 : 170, 200);
      this.enemies.forEach((enemy) => {
        if (enemy.active && Phaser.Geom.Intersects.RectangleToRectangle(range, enemy.getBounds())) {
          enemy.hit(damage, this.player.x);
          this.player.addWind(6);
        }
      });
      if (this.boss?.active && Phaser.Geom.Intersects.RectangleToRectangle(range, this.boss.getBounds())) {
        this.boss.hit(damage, this.player.x);
        this.player.addWind(5);
      }
      if (this.levelId === 3) this.hitHeartSequence(range);
    });
    this.events.on("wind-vfx", (x: number, y: number, color: number) => this.windVfx(x, y, color));
    this.events.on("trishula-ultimate", (cast: TrishulaCastOrigin) =>
      this.startTrishulaUltimate(cast),
    );
    this.events.on("hostile-projectile", (payload: HostileProjectilePayload) =>
      this.spawnHostileProjectile(payload),
    );
    this.events.on(
      "enemy-telegraph",
      (payload: {
        kind: HostileProjectileKind | "melee";
        x: number;
        y: number;
        targetX: number;
        targetY: number;
        direction: number;
        duration: number;
      }) => this.enemyTelegraphVfx(payload),
    );
    this.events.on("enemy-melee-impact", (x: number, y: number, direction: number) =>
      this.enemyMeleeVfx(x, y, direction),
    );
    this.events.on(
      "boss-telegraph",
      (x: number, y: number, direction: number, duration: number) =>
        this.bossTelegraphVfx(x, y, direction, duration),
    );
    this.events.on(
      "projectile-impact",
      (x: number, y: number, kind: HostileProjectileKind) =>
        this.projectileImpactVfx(x, y, kind),
    );
    this.events.on("boss-slam", (x: number, y: number) => {
      this.impactVfx(x, y, 0xffc44f);
      if (saveStore.get().settings.screenShake) this.cameras.main.shake(100, 0.0035);
    });
    this.events.on("boss-health", (health: number, max: number) => {
      this.bossBar.width = 490 * (health / max);
    });
    this.events.on("boss-defeated", () => this.onBossDefeated());
    this.events.on("player-defeated", () => this.respawn());
    this.events.on("enemy-defeated", (x: number, y: number) => {
      this.windVfx(x, y, 0x9a7cff);
      this.player.addWind(12);
    });
  }

  private hitHeartSequence(range: Phaser.Geom.Rectangle): void {
    const seal = this.heartSeals.find(
      (candidate) =>
        candidate.active && Phaser.Geom.Intersects.RectangleToRectangle(range, candidate.getBounds()),
    );
    if (seal) {
      seal.destroy();
      audioDirector.play("hit");
      this.flashMessage(`ผนึกถูกทำลาย ${3 - this.heartSeals.filter((item) => item.active).length}/3`, 0xb7ff70);
      return;
    }
    const sealsRemain = this.heartSeals.some((item) => item.active);
    if (this.heart?.active && !sealsRemain && Phaser.Geom.Intersects.RectangleToRectangle(range, this.heart.getBounds())) {
      this.heartHits += 1;
      this.heart.setTintFill(0xffffff);
      this.time.delayedCall(80, () => this.heart?.clearTint());
      this.flashMessage(`ดวงใจไมยราพ ${this.heartHits}/3`, 0xe8ff76);
      if (this.heartHits >= 3) {
        this.heart.destroy();
        this.instruction.setText("ดวงใจถูกทำลาย! ไมยราพสูญเสียความเป็นอมตะ");
        this.time.delayedCall(2200, () => this.instruction.setText(""));
      }
    }
  }

  private startBoss(): void {
    this.bossStarted = true;
    this.enemies.forEach((enemy) => {
      if (enemy.active && enemy.x > 3000) enemy.disableBody(true, true);
    });
    const bossX = this.levelId === 1 ? 3690 : this.levelId === 2 ? 3585 : 3530;
    const bossSurface = getTerrainSurfaceAt(this.levelId, bossX);
    const bossY =
      this.levelId === 2 ? this.getSurfaceY(bossX) - 120 : this.getActorSpawnY(bossX);
    this.boss = new Boss(
      this,
      bossX,
      bossY,
      this.level.bossTexture,
      this.player,
      this.levelId,
      this.levelId === 2 || !bossSurface
        ? undefined
        : { left: bossSurface.x, right: bossSurface.x + bossSurface.width },
    );
    this.physics.add.collider(this.boss, this.platforms);
    this.bossBarBg.setVisible(true);
    this.bossBar.setVisible(true);
    this.bossLabel.setVisible(true);
    this.cameras.main.stopFollow();
    this.cameras.main.pan(3200, 360, 700, "Sine.easeInOut", false, (_camera, progress) => {
      if (progress === 1) {
        this.cameras.main.setBounds(BOSS_ARENA.left, 0, BOSS_ARENA.width, 720);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.1);
      }
    });
    this.flashMessage(this.level.bossName[saveStore.get().settings.language], 0xffd36d);
  }

  private onBossDefeated(): void {
    this.bossDefeated = true;
    this.clearHostileProjectiles();
    this.bossBarBg.setVisible(false);
    this.bossBar.setVisible(false);
    this.bossLabel.setVisible(false);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, 720);
    audioDirector.play("victory");
    const message =
      this.levelId === 2
        ? "มัจฉานุยุติการต่อสู้และเปิดทางลับ"
        : this.levelId === 3
          ? "ไมยราพสิ้นฤทธิ์ พระรามได้รับการช่วยเหลือ"
          : "ประตูบาดาลเปิดออก";
    this.flashMessage(message, 0xffe09a, 2800);
    this.events.emit("reveal-exit");
  }

  private finishLevel(): void {
    if (this.completing) return;
    this.completing = true;
    const elapsed = this.time.now - this.startTime;
    saveStore.completeLevel(this.levelId, elapsed, this.player.stats.damageTaken);
    this.cameras.main.fadeOut(800, 3, 5, 13);
    this.time.delayedCall(850, () =>
      this.scene.start("ResultScene", {
        levelId: this.levelId,
        timeMs: elapsed,
        damageTaken: this.player.stats.damageTaken,
        collectibles: this.collected.size,
      }),
    );
  }

  private respawn(): void {
    if (!this.player.active || this.completing) return;
    this.player.setActive(false);
    this.clearHostileProjectiles();
    this.physics.pause();
    this.cameras.main.fadeOut(320, 30, 5, 18);
    this.time.delayedCall(550, () => {
      const respawnX = resolveRespawnX(
        this.checkpointX,
        this.bossStarted,
        this.bossDefeated,
      );
      this.player.setPosition(respawnX, this.getActorSpawnY(respawnX));
      this.player.setVelocity(0, 0);
      this.player.healAndRestore();
      this.player.setActive(true);
      this.physics.resume();
      this.cameras.main.fadeIn(320, 5, 8, 20);
    });
  }

  private pauseGame(): void {
    if (this.scene.isPaused()) return;
    touchInput.reset();
    this.scene.pause();
    this.scene.launch("PauseScene", { owner: this.scene.key });
  }

  private showStory(): void {
    const language = saveStore.get().settings.language;
    const shade = this.add.rectangle(640, 360, 1280, 720, 0x030510, 0.48).setScrollFactor(0).setDepth(80);
    const chapter = this.add
      .text(640, 265, `ด่าน ${this.levelId} • CHAPTER 0${this.levelId}`, {
        fontFamily: FONT_FAMILY,
        fontSize: "18px",
        color: "#70def0",
        letterSpacing: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(81);
    const title = this.add
      .text(640, 320, this.level.title[language], {
        fontFamily: FONT_FAMILY,
        fontSize: "44px",
        fontStyle: "bold",
        color: "#fff1c6",
        stroke: "#080812",
        strokeThickness: 7,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(81);
    const story = this.add
      .text(640, 390, this.level.story[language], {
        fontFamily: FONT_FAMILY,
        fontSize: "20px",
        color: "#d5deef",
        align: "center",
        wordWrap: { width: 790 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(81);
    this.time.delayedCall(2600, () => {
      this.tweens.add({
        targets: [shade, chapter, title, story],
        alpha: 0,
        duration: 650,
        onComplete: () => [shade, chapter, title, story].forEach((item) => item.destroy()),
      });
      if (this.levelId === 1) {
        this.instruction.setText(
          "A/D หรือ ◀ ▶ เคลื่อนที่ · SPACE/กระโดด · J/โจมตี · K/ตรีศูลวายุ",
        );
        this.time.delayedCall(5000, () => this.instruction.setText(""));
      }
    });
  }

  private flashMessage(text: string, color: number, duration = 1500): void {
    const message = this.add
      .text(640, 145, text, {
        fontFamily: FONT_FAMILY,
        fontSize: "25px",
        fontStyle: "bold",
        color: `#${color.toString(16).padStart(6, "0")}`,
        backgroundColor: "#060915dd",
        padding: { x: 22, y: 11 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(75)
      .setAlpha(0);
    this.tweens.add({
      targets: message,
      alpha: 1,
      y: 132,
      duration: 240,
      yoyo: true,
      hold: duration,
      onComplete: () => message.destroy(),
    });
  }

  private windVfx(x: number, y: number, color: number): void {
    for (let index = 0; index < 8; index += 1) {
      const particle = this.add.circle(x, y, Phaser.Math.Between(2, 6), color, 0.75).setDepth(30);
      const angle = (Math.PI * 2 * index) / 8;
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * Phaser.Math.Between(55, 115),
        y: y + Math.sin(angle) * Phaser.Math.Between(40, 90),
        alpha: 0,
        scale: 0.2,
        duration: 420,
        onComplete: () => particle.destroy(),
      });
    }
  }

  private impactVfx(x: number, y: number, color: number): void {
    const ring = this.add.circle(x, y, 18, color, 0).setStrokeStyle(5, color, 0.8).setDepth(31);
    this.tweens.add({
      targets: ring,
      scale: 4,
      alpha: 0,
      duration: 300,
      onComplete: () => ring.destroy(),
    });
  }

  private getSurfaceY(x: number): number {
    return getTerrainSurfaceY(this.levelId, x) ?? 548;
  }

  private getActorSpawnY(x: number): number {
    return this.getSurfaceY(x) - 72;
  }

  private spawnHostileProjectile(payload: HostileProjectilePayload): void {
    if (!payload.kind) return;
    const projectile = new HostileProjectile(
      this,
      payload,
      this.player,
      this.platforms,
    );
    this.hostileProjectiles.add(projectile);
    audioDirector.play("attack");
  }

  private updateHostileProjectiles(time: number): void {
    this.hostileProjectiles.forEach((projectile) => {
      if (!projectile.active) {
        this.hostileProjectiles.delete(projectile);
        return;
      }
      projectile.update(time);
    });
  }

  private clearHostileProjectiles(): void {
    this.hostileProjectiles.forEach((projectile) => projectile.destroy());
    this.hostileProjectiles.clear();
  }

  private enemyTelegraphVfx(payload: {
    kind: HostileProjectileKind | "melee";
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    direction: number;
    duration: number;
  }): void {
    const color =
      payload.kind === "arrow"
        ? 0xffc767
        : payload.kind === "mage-orb"
          ? 0x79ff65
          : payload.kind === "bat-bolt"
            ? 0x79cfff
            : 0xff745f;
    if (payload.kind === "melee") {
      const warning = this.add
        .rectangle(payload.x, payload.y + 12, 118, 138, color, 0.12)
        .setStrokeStyle(3, color, 0.82)
        .setDepth(29)
        .setScale(0.75);
      this.tweens.add({
        targets: warning,
        scale: 1,
        alpha: 0,
        duration: payload.duration,
        ease: "Quad.easeIn",
        onComplete: () => warning.destroy(),
      });
      return;
    }

    const guide = this.add.graphics().setDepth(29);
    guide.lineStyle(payload.kind === "arrow" ? 2 : 3, color, 0.62);
    guide.lineBetween(payload.x, payload.y, payload.targetX, payload.targetY);
    const pulse = this.add
      .circle(payload.x, payload.y, 14, color, 0.15)
      .setStrokeStyle(3, color, 0.9)
      .setDepth(30);
    this.tweens.add({
      targets: pulse,
      scale: 2.1,
      alpha: 0,
      duration: payload.duration,
      onComplete: () => pulse.destroy(),
    });
    this.tweens.add({
      targets: guide,
      alpha: 0,
      duration: payload.duration,
      onComplete: () => guide.destroy(),
    });
  }

  private bossTelegraphVfx(
    x: number,
    y: number,
    direction: number,
    duration: number,
  ): void {
    const warning = this.add
      .ellipse(x + direction * 92, y - 18, 250, 86, 0xff5e52, 0.12)
      .setStrokeStyle(4, 0xffcc65, 0.92)
      .setDepth(30)
      .setScale(0.58);
    this.tweens.add({
      targets: warning,
      scaleX: 1,
      scaleY: 1,
      alpha: 0,
      duration,
      ease: "Cubic.easeIn",
      onComplete: () => warning.destroy(),
    });
  }

  private enemyMeleeVfx(x: number, y: number, direction: number): void {
    const slash = this.add
      .ellipse(x, y, 76, 128, 0xffc96b, 0)
      .setStrokeStyle(8, 0xffd37e, 0.88)
      .setDepth(31)
      .setAngle(direction < 0 ? -28 : 28)
      .setScale(0.55);
    this.tweens.add({
      targets: slash,
      scale: 1.25,
      alpha: 0,
      duration: 220,
      onComplete: () => slash.destroy(),
    });
  }

  private projectileImpactVfx(
    x: number,
    y: number,
    kind: HostileProjectileKind,
  ): void {
    const color =
      kind === "arrow"
        ? 0xffc567
        : kind === "mage-orb"
          ? 0x6dff68
          : kind === "bat-bolt"
            ? 0x6ccfff
            : 0xffd068;
    this.impactVfx(x, y, color);
  }

  private startTrishulaUltimate(cast: TrishulaCastOrigin): void {
    if (this.trishula) return;

    const sigil = this.add
      .ellipse(
        cast.x + cast.direction * TRISHULA_RADIUS_X,
        cast.y,
        TRISHULA_RADIUS_X * 2,
        TRISHULA_RADIUS_Y * 2,
        0x67e8ff,
        0.025,
      )
      .setStrokeStyle(3, 0xf8d36b, 0.5)
      .setDepth(28)
      .setScale(0.78)
      .setAlpha(0);
    this.tweens.add({
      targets: sigil,
      scale: 1,
      alpha: 0.55,
      duration: 220,
      yoyo: true,
      hold: 520,
    });

    const aura = this.add
      .image(cast.x, cast.y, "trishula-ultimate")
      .setDisplaySize(282, 71)
      .setDepth(34)
      .setTint(0x72eaff)
      .setAlpha(0.36)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setFlipX(cast.direction < 0);
    const sprite = this.add
      .image(cast.x, cast.y, "trishula-ultimate")
      .setDisplaySize(254, 64)
      .setDepth(36)
      .setFlipX(cast.direction < 0);

    this.trishula = {
      sprite,
      aura,
      sigil,
      cast,
      startedAt: this.time.now,
      lastTrailAt: -9999,
      lastRelicHitAt: -9999,
      hitTargets: new Set(),
    };

    this.flashMessage("ตรีศูลวายุ • DIVINE TRISHULA", 0xffdc78, 680);
    this.castTrishulaBurst(cast.x, cast.y);
    if (saveStore.get().settings.screenShake) this.cameras.main.shake(110, 0.0028);
  }

  private updateTrishulaUltimate(time: number): void {
    const runtime = this.trishula;
    if (!runtime) return;

    const elapsed = time - runtime.startedAt;
    const position = getTrishulaPosition(elapsed, runtime.cast, {
      x: this.player.x,
      y: this.player.y,
    });
    const rotation = runtime.cast.direction * elapsed * 0.019;
    runtime.sprite.setPosition(position.x, position.y).setRotation(rotation);
    runtime.aura
      .setPosition(position.x, position.y)
      .setRotation(rotation)
      .setAlpha(0.24 + Math.sin(elapsed * 0.035) * 0.1);

    const trailInterval = saveStore.get().settings.quality === "low" ? 88 : 48;
    if (time - runtime.lastTrailAt >= trailInterval) {
      runtime.lastTrailAt = time;
      this.spawnTrishulaTrail(position.x, position.y, rotation, runtime.cast.direction < 0);
    }

    const hitbox = new Phaser.Geom.Rectangle(position.x - 82, position.y - 62, 164, 124);
    this.enemies.forEach((enemy) => {
      if (
        enemy.active &&
        !runtime.hitTargets.has(enemy) &&
        Phaser.Geom.Intersects.RectangleToRectangle(hitbox, enemy.getBounds())
      ) {
        runtime.hitTargets.add(enemy);
        enemy.hit(70, this.player.x);
        this.impactVfx(enemy.x, enemy.y - 55, 0xffdc72);
      }
    });
    if (
      this.boss?.active &&
      !runtime.hitTargets.has(this.boss) &&
      Phaser.Geom.Intersects.RectangleToRectangle(hitbox, this.boss.getBounds())
    ) {
      runtime.hitTargets.add(this.boss);
      this.boss.hit(48, this.player.x);
      this.impactVfx(this.boss.x, this.boss.y - 80, 0x7cecff);
    }
    if (this.levelId === 3 && time - runtime.lastRelicHitAt > 150) {
      runtime.lastRelicHitAt = time;
      this.hitHeartSequence(hitbox);
    }

    if (position.phase === "return" && runtime.sigil.alpha > 0) {
      runtime.sigil.setAlpha(Math.max(0, runtime.sigil.alpha - 0.04));
    }
    if (position.phase === "complete") this.finishTrishulaUltimate();
  }

  private spawnTrishulaTrail(
    x: number,
    y: number,
    rotation: number,
    flipped: boolean,
  ): void {
    const afterimage = this.add
      .image(x, y, "trishula-ultimate")
      .setDisplaySize(238, 60)
      .setDepth(32)
      .setRotation(rotation)
      .setFlipX(flipped)
      .setTint(0x7cecff)
      .setAlpha(0.25)
      .setBlendMode(Phaser.BlendModes.ADD);
    const targetScaleX = afterimage.scaleX * 0.8;
    const targetScaleY = afterimage.scaleY * 0.8;
    this.tweens.add({
      targets: afterimage,
      alpha: 0,
      scaleX: targetScaleX,
      scaleY: targetScaleY,
      duration: 230,
      ease: "Quad.easeOut",
      onComplete: () => afterimage.destroy(),
    });

    const spark = this.add
      .star(x, y, 4, 2, 7, 0xffe39a, 0.9)
      .setDepth(35)
      .setRotation(rotation);
    this.tweens.add({
      targets: spark,
      x: x + Phaser.Math.Between(-42, 42),
      y: y + Phaser.Math.Between(-34, 34),
      angle: spark.angle + 120,
      alpha: 0,
      scale: 0.2,
      duration: 260,
      onComplete: () => spark.destroy(),
    });
  }

  private castTrishulaBurst(x: number, y: number): void {
    const ring = this.add
      .circle(x, y, 24, 0x67e8ff, 0.06)
      .setStrokeStyle(6, 0xffd86b, 0.95)
      .setDepth(37);
    this.tweens.add({
      targets: ring,
      scale: 4.8,
      alpha: 0,
      duration: 420,
      ease: "Cubic.easeOut",
      onComplete: () => ring.destroy(),
    });
    this.windVfx(x, y, 0xffdf7d);
    this.windVfx(x, y, 0x68eaff);
  }

  private finishTrishulaUltimate(): void {
    const runtime = this.trishula;
    if (!runtime) return;
    const catchX = this.player.x + runtime.cast.direction * 24;
    const catchY = this.player.y - 76;
    runtime.sprite.destroy();
    runtime.aura.destroy();
    runtime.sigil.destroy();
    this.trishula = undefined;
    this.castTrishulaBurst(catchX, catchY);
    audioDirector.play("checkpoint");
    if (saveStore.get().settings.screenShake) this.cameras.main.shake(90, 0.002);
  }
}
