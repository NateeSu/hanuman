import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import type { Player } from "./Player";

const PLATFORM_EDGE_MARGIN = 48;

export class Boss extends Phaser.Physics.Arcade.Sprite {
  health: number;
  readonly maxHealth: number;
  private nextActionAt = 0;
  private phase = 1;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    private readonly player: Player,
    private readonly levelId: number,
    private readonly movementBounds?: { left: number; right: number },
  ) {
    super(scene, x, y, texture);
    this.maxHealth = levelId === 3 ? 320 : levelId === 2 ? 240 : 205;
    this.health = this.maxHealth;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(texture === "gatekeeper" ? 0.36 : texture === "matchanu" ? 0.38 : 0.36);
    this.setOrigin(0.5, 0.92);
    this.setDepth(19);
    this.setCollideWorldBounds(true);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(Math.min(this.width * 0.44, 180), Math.min(this.height * 0.72, 310));
    body.setOffset((this.width - body.width) / 2, this.height - body.height);
    if (levelId === 2) body.setAllowGravity(false);
  }

  update(time: number): void {
    if (!this.active) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (this.movementBounds) {
      const minX = this.movementBounds.left + PLATFORM_EDGE_MARGIN;
      const maxX = this.movementBounds.right - PLATFORM_EDGE_MARGIN;
      const constrainedX = Phaser.Math.Clamp(this.x, minX, maxX);
      if (constrainedX !== this.x) {
        const movingOutward =
          (this.x < minX && body.velocity.x < 0) || (this.x > maxX && body.velocity.x > 0);
        this.setX(constrainedX);
        if (movingOutward) body.setVelocityX(0);
      }
    }
    if (time < this.nextActionAt) return;
    const distance = this.player.x - this.x;
    const direction = distance < 0 ? -1 : 1;
    const blockedByPlatformEdge =
      this.movementBounds !== undefined &&
      ((direction < 0 && this.x <= this.movementBounds.left + PLATFORM_EDGE_MARGIN) ||
        (direction > 0 && this.x >= this.movementBounds.right - PLATFORM_EDGE_MARGIN));
    this.setFlipX(distance > 0);
    this.nextActionAt = time + (this.phase === 1 ? 1250 : 900);

    if (Math.abs(distance) > 180 && !blockedByPlatformEdge) {
      this.setTint(0xffc85f);
      this.scene.time.delayedCall(240, () => {
        if (!this.active) return;
        this.clearTint();
        const speed = this.phase === 1 ? 290 : 390;
        const availableTravel = this.movementBounds
          ? direction < 0
            ? this.x - (this.movementBounds.left + PLATFORM_EDGE_MARGIN)
            : this.movementBounds.right - PLATFORM_EDGE_MARGIN - this.x
          : Number.POSITIVE_INFINITY;
        const dashDuration = Math.min(300, (availableTravel / speed) * 1000);
        body.setVelocityX(direction * speed);
        this.scene.time.delayedCall(Math.max(40, dashDuration), () => body.setVelocityX(0));
      });
    } else {
      this.setTint(0xff6b81);
      const windupMs = this.phase === 1 ? 420 : 330;
      this.scene.events.emit("boss-telegraph", this.x, this.y, direction, windupMs);
      this.scene.time.delayedCall(windupMs, () => {
        if (!this.active) return;
        this.clearTint();
        this.scene.events.emit("boss-slam", this.x, this.y, this.phase);
        this.scene.events.emit("hostile-projectile", {
          kind: "boss-wave",
          x: this.x + direction * 72,
          y: this.y - (this.levelId === 2 ? 55 : 34),
          targetX: this.x + direction * 600,
          targetY: this.y - 34,
          damage: this.phase === 1 ? 18 : 20,
          sourceX: this.x,
        });
      });
    }
  }

  hit(amount: number, fromX: number): void {
    if (!this.active) return;
    this.health = Math.max(0, this.health - amount);
    if (this.health <= this.maxHealth / 2) this.phase = 2;
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(90, () => this.clearTint());
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(fromX < this.x ? 100 : -100);
    audioDirector.play("hit");
    this.scene.events.emit("boss-health", this.health, this.maxHealth);
    if (this.health <= 0) {
      this.scene.events.emit("boss-defeated");
      this.disableBody(true, true);
    }
  }
}
