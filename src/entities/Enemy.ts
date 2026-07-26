import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import type { Player } from "./Player";

export type EnemyKind = "yak-guard" | "yak-archer" | "bat-spirit" | "shadow-mage";

const enemyConfig: Record<EnemyKind, { health: number; speed: number; damage: number; scale: number }> = {
  "yak-guard": { health: 55, speed: 75, damage: 12, scale: 0.28 },
  "yak-archer": { health: 42, speed: 48, damage: 10, scale: 0.27 },
  "bat-spirit": { health: 28, speed: 95, damage: 8, scale: 0.23 },
  "shadow-mage": { health: 48, speed: 58, damage: 14, scale: 0.25 },
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  readonly kind: EnemyKind;
  health: number;
  private readonly player: Player;
  private readonly config: (typeof enemyConfig)[EnemyKind];
  private nextAttackAt = 0;
  private spawnX: number;

  constructor(scene: Phaser.Scene, x: number, y: number, kind: EnemyKind, player: Player) {
    super(scene, x, y, kind);
    this.kind = kind;
    this.player = player;
    this.config = enemyConfig[kind];
    this.health = this.config.health;
    this.spawnX = x;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(this.config.scale);
    this.setOrigin(0.5, 0.9);
    this.setDepth(18);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(Math.min(this.width * 0.48, 145), Math.min(this.height * 0.72, 245));
    body.setOffset((this.width - body.width) / 2, this.height - body.height);
    if (kind === "bat-spirit") {
      body.setAllowGravity(false);
      this.y -= 90;
    }
  }

  update(time: number): void {
    if (!this.active || !this.body) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    const distance = this.player.x - this.x;
    const range = this.kind === "yak-archer" || this.kind === "shadow-mage" ? 330 : 95;
    this.setFlipX(distance > 0);

    if (Math.abs(distance) > 560) {
      body.setVelocityX(0);
      return;
    }

    if (Math.abs(distance) > range) {
      body.setVelocityX(Math.sign(distance) * this.config.speed);
    } else {
      body.setVelocityX(0);
      if (time >= this.nextAttackAt) {
        this.nextAttackAt = time + (this.kind === "yak-guard" ? 1100 : 1450);
        this.setTint(0xffd36a);
        this.scene.time.delayedCall(190, () => {
          if (!this.active) return;
          this.clearTint();
          if (Math.abs(this.player.x - this.x) < range + 40) {
            this.player.takeDamage(this.config.damage, this.x);
            this.scene.events.emit("enemy-strike", this.x, this.y - 35, this.kind);
          }
        });
      }
    }

    if (this.kind === "bat-spirit") {
      this.y = this.y + Math.sin((time + this.spawnX) * 0.004) * 0.8;
    }
  }

  hit(amount: number, fromX: number): void {
    if (!this.active) return;
    this.health -= amount;
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(80, () => this.clearTint());
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocityX(fromX < this.x ? 170 : -170);
    audioDirector.play("hit");
    if (this.health <= 0) {
      this.scene.events.emit("enemy-defeated", this.x, this.y, this.kind);
      this.disableBody(true, true);
    }
  }
}
