import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import { bossProfileFor, type BossProfile } from "../data/bosses";
import type { LevelId } from "../data/types";
import type { HostileProjectileKind } from "./HostileProjectile";
import type { Player } from "./Player";

const PLATFORM_EDGE_MARGIN = 48;
type BossPose = "idle" | "cast" | "strike";

export class Boss extends Phaser.Physics.Arcade.Sprite {
  health: number;
  readonly maxHealth: number;
  private nextActionAt = 0;
  private phase = 1;
  private actionIndex = 0;
  private readonly profile: BossProfile;
  private readonly aura: Phaser.GameObjects.Image;
  private readonly hoverBaseY: number;
  private readonly textureBase: string;
  private poseRevision = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    private readonly player: Player,
    levelId: LevelId,
    private readonly movementBounds?: { left: number; right: number },
  ) {
    super(scene, x, y, `${texture}-idle`);
    this.textureBase = texture;
    this.profile = bossProfileFor(levelId);
    this.maxHealth = this.profile.maxHealth;
    this.health = this.maxHealth;
    this.hoverBaseY = y;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(
      this.profile.displaySize.width,
      this.profile.displaySize.height,
    );
    this.setOrigin(0.5, 0.92);
    this.setDepth(19);
    this.setCollideWorldBounds(true);

    this.aura = scene.add
      .image(x, y, `${texture}-idle`)
      .setOrigin(0.5, 0.92)
      .setDepth(18)
      .setTintFill(this.profile.glowColor)
      .setAlpha(0.2)
      .setBlendMode(Phaser.BlendModes.ADD);
    this.aura.setDisplaySize(
      this.profile.displaySize.width * 1.08,
      this.profile.displaySize.height * 1.08,
    );
    scene.tweens.add({
      targets: this.aura,
      alpha: 0.1,
      duration: 620,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    const body = this.body as Phaser.Physics.Arcade.Body;
    const rawBodyWidth = this.profile.body.width / Math.abs(this.scaleX);
    const rawBodyHeight = this.profile.body.height / Math.abs(this.scaleY);
    body.setSize(rawBodyWidth, rawBodyHeight);
    body.setOffset(
      (this.width - rawBodyWidth) / 2,
      this.height - rawBodyHeight,
    );
    body.setAllowGravity(!this.profile.floating);
  }

  update(time: number): void {
    if (!this.active) {
      this.aura.setVisible(false);
      return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.profile.floating) {
      body.setVelocityY(0);
      this.y = this.hoverBaseY + Math.sin(time * 0.0035) * 20;
    }
    this.constrainToPlatform(body);

    const distance = this.player.x - this.x;
    const direction = distance < 0 ? -1 : 1;
    this.setFlipX(distance > 0);
    this.syncAura();

    if (time < this.nextActionAt) return;
    this.actionIndex += 1;
    this.nextActionAt =
      time +
      (this.phase === 1
        ? this.profile.actionDelay.phase1
        : this.profile.actionDelay.phase2);

    switch (this.profile.style) {
      case "gatekeeper":
        if (this.actionIndex % 3 === 1) {
          this.beginRanged(direction, "shield-disc", 430);
        } else if (
          this.actionIndex % 3 === 2 &&
          Math.abs(distance) > 170
        ) {
          this.beginCharge(direction, this.phase === 1 ? 300 : 410, 280);
        } else {
          this.beginSlam(direction, 390, "shield-disc");
        }
        break;
      case "elephant":
        if (this.actionIndex % 3 === 1 && Math.abs(distance) > 210) {
          this.beginCharge(direction, this.phase === 1 ? 330 : 430, 300);
        } else if (this.actionIndex % 3 === 2) {
          this.beginRanged(direction, "tusk-wave", 390);
        } else {
          this.beginSlam(direction, 420, this.profile.projectile);
        }
        break;
      case "golem":
        if (this.actionIndex % 3 === 1) {
          this.beginRanged(direction, this.profile.projectile, 520);
        } else if (this.actionIndex % 3 === 2) {
          this.beginSlam(direction, 500, this.profile.projectile);
        } else if (Math.abs(distance) > 170) {
          this.beginCharge(direction, this.phase === 1 ? 250 : 340, 380);
        } else {
          this.beginSlam(direction, 430, this.profile.projectile);
        }
        break;
      case "queen":
        if (this.actionIndex % 3 === 0 && Math.abs(distance) < 230) {
          this.beginCharge(direction, this.phase === 1 ? 370 : 470, 230);
        } else if (this.phase === 2 && this.actionIndex % 2 === 0) {
          this.beginVolley(direction, this.profile.projectile, 410, 76);
        } else {
          this.beginRanged(direction, this.profile.projectile, 390);
        }
        break;
      case "matchanu":
        if (this.actionIndex % 3 === 1) {
          this.beginRanged(direction, "tidal-trident", 390);
        } else if (
          this.actionIndex % 3 === 2 &&
          Math.abs(distance) > 150
        ) {
          this.beginCharge(direction, this.phase === 1 ? 350 : 455, 240);
        } else {
          this.beginSlam(direction, 360, "tidal-trident");
        }
        break;
      case "gaoler":
        if (this.actionIndex % 3 === 1) {
          this.beginRanged(direction, this.profile.projectile, 440);
        } else if (this.phase === 2 && this.actionIndex % 3 === 2) {
          this.beginVolley(direction, this.profile.projectile, 460, 92);
        } else {
          this.beginSlam(direction, 390, this.profile.projectile);
        }
        break;
      case "maiyarap":
        if (this.actionIndex % 3 === 1) {
          this.beginRanged(direction, "hypnosis-orb", 480);
        } else if (this.actionIndex % 3 === 2) {
          this.beginSlam(direction, this.phase === 1 ? 430 : 350, "hypnosis-orb");
        } else if (this.phase === 2) {
          this.beginVolley(direction, "hypnosis-orb", 520, 105);
        } else {
          this.beginCharge(direction, 320, 300);
        }
        break;
    }
  }

  hit(amount: number, fromX: number): void {
    if (!this.active) return;
    this.health = Math.max(0, this.health - amount);
    if (this.health <= this.maxHealth / 2) this.phase = 2;
    this.setTintFill(0xffffff);
    this.aura.setAlpha(0.5);
    this.scene.time.delayedCall(90, () => {
      if (!this.active) return;
      this.clearTint();
      this.aura.setAlpha(0.2);
    });
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(fromX < this.x ? 100 : -100);
    audioDirector.play("hit");
    this.scene.events.emit("boss-health", this.health, this.maxHealth);
    if (this.health <= 0) {
      this.scene.events.emit("boss-defeated");
      this.aura.destroy();
      this.disableBody(true, true);
    }
  }

  private beginCharge(direction: number, speed: number, windupMs: number): void {
    if (this.blockedByPlatformEdge(direction)) {
      this.beginRanged(direction, this.profile.projectile, windupMs + 80);
      return;
    }
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.setPose("cast");
    this.setTint(this.profile.glowColor);
    this.scene.events.emit(
      "boss-telegraph",
      this.x,
      this.y,
      direction,
      windupMs,
      this.profile.glowColor,
      "charge",
    );
    this.scene.time.delayedCall(windupMs, () => {
      if (!this.active) return;
      this.clearTint();
      this.setPose("strike");
      const availableTravel = this.movementBounds
        ? direction < 0
          ? this.x - (this.movementBounds.left + PLATFORM_EDGE_MARGIN)
          : this.movementBounds.right - PLATFORM_EDGE_MARGIN - this.x
        : 420;
      const dashDuration = Math.min(440, (availableTravel / speed) * 1000);
      body.setVelocityX(direction * speed);
      this.scene.time.delayedCall(Math.max(80, dashDuration), () => {
        if (!this.active) return;
        body.setVelocityX(0);
        this.setPose("idle");
        this.scene.events.emit(
          "boss-slam",
          this.x,
          this.y,
          this.profile.glowColor,
        );
      });
    });
  }

  private beginSlam(
    direction: number,
    windupMs: number,
    projectile: HostileProjectileKind,
  ): void {
    this.setPose("cast");
    this.setTint(this.profile.glowColor);
    this.scene.events.emit(
      "boss-telegraph",
      this.x,
      this.y,
      direction,
      windupMs,
      this.profile.glowColor,
      projectile,
    );
    this.scene.time.delayedCall(windupMs, () => {
      if (!this.active) return;
      this.clearTint();
      this.setPose("strike", 300);
      this.scene.events.emit(
        "boss-slam",
        this.x,
        this.y,
        this.profile.glowColor,
      );
      this.fireProjectile(direction, projectile);
    });
  }

  private beginRanged(
    direction: number,
    projectile: HostileProjectileKind,
    windupMs: number,
  ): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);
    this.setPose("cast");
    this.setTint(this.profile.glowColor);
    this.scene.events.emit(
      "boss-telegraph",
      this.x,
      this.y,
      direction,
      windupMs,
      this.profile.glowColor,
      projectile,
    );
    this.scene.time.delayedCall(windupMs, () => {
      if (!this.active) return;
      this.clearTint();
      this.setPose("strike", 260);
      this.fireProjectile(direction, projectile);
    });
  }

  private beginVolley(
    direction: number,
    projectile: HostileProjectileKind,
    windupMs: number,
    verticalSpread: number,
  ): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(0);
    this.setPose("cast");
    this.setTint(this.profile.glowColor);
    this.scene.events.emit(
      "boss-telegraph",
      this.x,
      this.y,
      direction,
      windupMs,
      this.profile.glowColor,
      projectile,
    );
    this.scene.time.delayedCall(windupMs, () => {
      if (!this.active) return;
      this.clearTint();
      this.setPose("strike", 340);
      [-verticalSpread, 0, verticalSpread].forEach((targetOffset, index) => {
        this.scene.time.delayedCall(index * 85, () => {
          if (!this.active) return;
          this.fireProjectile(direction, projectile, targetOffset);
        });
      });
    });
  }

  private fireProjectile(
    direction: number,
    projectile: HostileProjectileKind,
    targetYOffset = 0,
  ): void {
    const grounded = projectile === "boss-wave" || projectile === "tusk-wave";
    const launchY =
      this.y -
      (this.profile.style === "queen"
        ? 145
        : this.profile.style === "golem"
          ? 180
          : this.profile.style === "gaoler"
            ? 155
            : 50);
    this.scene.events.emit("hostile-projectile", {
      kind: projectile,
      x: this.x + direction * (this.profile.style === "elephant" ? 150 : 76),
      y: grounded ? this.y - 34 : launchY,
      targetX: this.player.x,
      targetY: grounded ? this.y - 34 : this.player.y - 72 + targetYOffset,
      damage:
        this.phase === 1
          ? this.profile.damage.phase1
          : this.profile.damage.phase2,
      sourceX: this.x,
    });
  }

  private blockedByPlatformEdge(direction: number): boolean {
    return (
      this.movementBounds !== undefined &&
      ((direction < 0 &&
        this.x <= this.movementBounds.left + PLATFORM_EDGE_MARGIN) ||
        (direction > 0 &&
          this.x >= this.movementBounds.right - PLATFORM_EDGE_MARGIN))
    );
  }

  private constrainToPlatform(body: Phaser.Physics.Arcade.Body): void {
    if (!this.movementBounds) return;
    const minX = this.movementBounds.left + PLATFORM_EDGE_MARGIN;
    const maxX = this.movementBounds.right - PLATFORM_EDGE_MARGIN;
    const constrainedX = Phaser.Math.Clamp(this.x, minX, maxX);
    if (constrainedX === this.x) return;
    const movingOutward =
      (this.x < minX && body.velocity.x < 0) ||
      (this.x > maxX && body.velocity.x > 0);
    this.setX(constrainedX);
    if (movingOutward) body.setVelocityX(0);
  }

  private setPose(pose: BossPose, resetAfterMs?: number): void {
    const revision = ++this.poseRevision;
    const texture = `${this.textureBase}-${pose}`;
    this.setTexture(texture);
    this.aura.setTexture(texture);
    if (resetAfterMs === undefined) return;
    this.scene.time.delayedCall(resetAfterMs, () => {
      if (!this.active || revision !== this.poseRevision) return;
      this.setPose("idle");
    });
  }

  private syncAura(): void {
    this.aura
      .setPosition(this.x, this.y)
      .setFlipX(this.flipX)
      .setVisible(this.visible);
  }
}
