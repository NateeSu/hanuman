import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import type { Player } from "./Player";

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
    levelId: number,
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
  }

  update(time: number): void {
    if (!this.active || time < this.nextActionAt) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    const distance = this.player.x - this.x;
    this.setFlipX(distance > 0);
    this.nextActionAt = time + (this.phase === 1 ? 1250 : 900);

    if (Math.abs(distance) > 180) {
      this.setTint(0xffc85f);
      this.scene.time.delayedCall(240, () => {
        if (!this.active) return;
        this.clearTint();
        body.setVelocityX(Math.sign(distance) * (this.phase === 1 ? 290 : 390));
        this.scene.time.delayedCall(300, () => body.setVelocityX(0));
      });
    } else {
      this.setTint(0xff6b81);
      this.scene.time.delayedCall(280, () => {
        if (!this.active) return;
        this.clearTint();
        if (Math.abs(this.player.x - this.x) < 230) this.player.takeDamage(18, this.x);
        this.scene.events.emit("boss-slam", this.x, this.y, this.phase);
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
