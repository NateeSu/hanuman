import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import type { HostileProjectileKind } from "./HostileProjectile";
import type { Player } from "./Player";

export type EnemyKind = "yak-guard" | "yak-archer" | "bat-spirit" | "shadow-mage";

const enemyConfig: Record<
  EnemyKind,
  { health: number; speed: number; damage: number; scale: number; glow: number }
> = {
  "yak-guard": {
    health: 55,
    speed: 75,
    damage: 12,
    scale: 0.28,
    glow: 0xffbd68,
  },
  "yak-archer": {
    health: 42,
    speed: 48,
    damage: 10,
    scale: 0.27,
    glow: 0xffdd78,
  },
  "bat-spirit": {
    health: 28,
    speed: 95,
    damage: 8,
    scale: 0.23,
    glow: 0x79d8ff,
  },
  "shadow-mage": {
    health: 48,
    speed: 58,
    damage: 14,
    scale: 0.25,
    glow: 0x8dff72,
  },
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  readonly kind: EnemyKind;
  health: number;
  private readonly player: Player;
  private readonly config: (typeof enemyConfig)[EnemyKind];
  private nextAttackAt = 0;
  private spawnX: number;
  private readonly aura: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    kind: EnemyKind,
    player: Player,
    private readonly patrol?: { left: number; right: number },
  ) {
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
    this.aura = scene.add
      .image(x, y, kind)
      .setScale(this.config.scale * 1.1)
      .setOrigin(0.5, 0.9)
      .setDepth(17)
      .setTintFill(this.config.glow)
      .setAlpha(0.18)
      .setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
      targets: this.aura,
      alpha: 0.08,
      duration: 720,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(Math.min(this.width * 0.48, 145), Math.min(this.height * 0.72, 245));
    body.setOffset((this.width - body.width) / 2, this.height - body.height);
    if (kind === "bat-spirit") {
      body.setAllowGravity(false);
      this.y -= 90;
      this.aura.y = this.y;
    }
  }

  update(time: number): void {
    if (!this.active || !this.body) {
      this.aura.setVisible(false);
      return;
    }
    const body = this.body as Phaser.Physics.Arcade.Body;
    const distance = this.player.x - this.x;
    const range =
      this.kind === "yak-archer"
        ? 420
        : this.kind === "shadow-mage"
          ? 390
          : this.kind === "bat-spirit"
            ? 300
            : 95;
    this.setFlipX(distance > 0);
    this.aura
      .setPosition(this.x, this.y)
      .setFlipX(this.flipX)
      .setVisible(this.visible);

    if (Math.abs(distance) > 560) {
      body.setVelocityX(0);
      return;
    }

    if (Math.abs(distance) > range) {
      const direction = Math.sign(distance);
      const nextX = this.x + direction * 34;
      const insidePatrol =
        this.kind === "bat-spirit" ||
        !this.patrol ||
        (nextX >= this.patrol.left + 28 && nextX <= this.patrol.right - 28);
      body.setVelocityX(insidePatrol ? direction * this.config.speed : 0);
    } else {
      body.setVelocityX(0);
      if (time >= this.nextAttackAt) {
        this.beginAttack(time);
      }
    }

    if (this.kind === "bat-spirit") {
      this.y = this.y + Math.sin((time + this.spawnX) * 0.004) * 0.8;
    }
  }

  private beginAttack(time: number): void {
    const direction = this.player.x < this.x ? -1 : 1;
    const isMelee = this.kind === "yak-guard";
    const windupMs = isMelee ? 260 : 360;
    const cooldown =
      this.kind === "yak-guard"
        ? 1100
        : this.kind === "bat-spirit"
          ? 1250
          : 1500;
    const projectileKind: HostileProjectileKind | undefined =
      this.kind === "yak-archer"
        ? "arrow"
        : this.kind === "shadow-mage"
          ? "mage-orb"
          : this.kind === "bat-spirit"
            ? "bat-bolt"
            : undefined;
    const launchOffsetY =
      this.kind === "yak-archer" ? 105 : this.kind === "shadow-mage" ? 115 : 48;
    const origin = {
      x: this.x + direction * (isMelee ? 62 : 48),
      y: this.y - launchOffsetY,
    };
    const target = {
      x: this.player.x,
      y: this.player.y - 72,
    };

    this.nextAttackAt = time + cooldown;
    this.setTint(isMelee ? 0xffba66 : 0xffef9a);
    this.scene.events.emit("enemy-telegraph", {
      kind: isMelee ? "melee" : projectileKind,
      x: origin.x,
      y: origin.y,
      targetX: target.x,
      targetY: target.y,
      direction,
      duration: windupMs,
    });
    this.scene.time.delayedCall(windupMs, () => {
      if (!this.active) return;
      this.clearTint();
      if (isMelee) {
        const hitbox = new Phaser.Geom.Rectangle(
          this.x + direction * 12 - (direction < 0 ? 120 : 0),
          this.y - 150,
          120,
          150,
        );
        this.scene.events.emit(
          "enemy-melee-impact",
          this.x + direction * 64,
          this.y - 70,
          direction,
        );
        if (Phaser.Geom.Intersects.RectangleToRectangle(hitbox, this.player.getBounds())) {
          this.player.takeDamage(this.config.damage, this.x);
        }
        return;
      }

      this.scene.events.emit("hostile-projectile", {
        kind: projectileKind,
        x: origin.x,
        y: origin.y,
        targetX: target.x,
        targetY: target.y,
        damage: this.config.damage,
        sourceX: this.x,
      });
    });
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
      this.aura.destroy();
      this.disableBody(true, true);
    }
  }
}
