import Phaser from "phaser";
import {
  PROJECTILE_SPEED,
  getProjectileVelocity,
  type HostileProjectileKind,
} from "../systems/projectileMotion";
import type { Player } from "./Player";

export type { HostileProjectileKind } from "../systems/projectileMotion";

export interface HostileProjectilePayload {
  kind: HostileProjectileKind;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  damage: number;
  sourceX: number;
}

interface ProjectileConfig {
  texture: string;
  speed: number;
  width: number;
  height: number;
  lifetimeMs: number;
  damageDelayMs: number;
  rotationSpeed: number;
  collidesWithTerrain: boolean;
}

const PROJECTILE_CONFIG: Record<HostileProjectileKind, ProjectileConfig> = {
  arrow: {
    texture: "projectile-arrow",
    speed: PROJECTILE_SPEED.arrow,
    width: 112,
    height: 24,
    lifetimeMs: 2100,
    damageDelayMs: 0,
    rotationSpeed: 0,
    collidesWithTerrain: true,
  },
  "mage-orb": {
    texture: "projectile-mage-orb",
    speed: PROJECTILE_SPEED["mage-orb"],
    width: 78,
    height: 49,
    lifetimeMs: 3000,
    damageDelayMs: 0,
    rotationSpeed: 0.004,
    collidesWithTerrain: true,
  },
  "bat-bolt": {
    texture: "projectile-bat-bolt",
    speed: PROJECTILE_SPEED["bat-bolt"],
    width: 76,
    height: 70,
    lifetimeMs: 2600,
    damageDelayMs: 0,
    rotationSpeed: 0.002,
    collidesWithTerrain: true,
  },
  "boss-wave": {
    texture: "projectile-boss-wave",
    speed: PROJECTILE_SPEED["boss-wave"],
    width: 148,
    height: 65,
    lifetimeMs: 2500,
    damageDelayMs: 120,
    rotationSpeed: 0,
    collidesWithTerrain: false,
  },
};

export class HostileProjectile extends Phaser.Physics.Arcade.Image {
  private readonly config: ProjectileConfig;
  private readonly startedAt: number;
  private lastTrailAt = -9999;

  constructor(
    scene: Phaser.Scene,
    payload: HostileProjectilePayload,
    player: Player,
    platforms: Phaser.Physics.Arcade.StaticGroup,
  ) {
    const config = PROJECTILE_CONFIG[payload.kind];
    super(scene, payload.x, payload.y, config.texture);
    this.config = config;
    this.startedAt = scene.time.now;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(config.width, config.height).setDepth(27);

    const velocity = getProjectileVelocity(
      payload.kind,
      { x: payload.x, y: payload.y },
      { x: payload.targetX, y: payload.targetY },
    );
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocity(velocity.x, velocity.y);
    body.setSize(this.width * 0.68, this.height * 0.62);
    body.setOffset((this.width - body.width) / 2, (this.height - body.height) / 2);
    this.setRotation(Math.atan2(velocity.y, velocity.x));

    scene.physics.add.overlap(this, player, () => {
      if (!this.active || !player.active) return;
      if (scene.time.now - this.startedAt < config.damageDelayMs) return;
      player.takeDamage(payload.damage, payload.sourceX);
      scene.events.emit("projectile-impact", this.x, this.y, payload.kind);
      this.destroy();
    });
    if (config.collidesWithTerrain) {
      scene.physics.add.collider(this, platforms, () => {
        if (!this.active) return;
        scene.events.emit("projectile-impact", this.x, this.y, payload.kind);
        this.destroy();
      });
    }
  }

  update(time: number): void {
    if (!this.active) return;
    if (time - this.startedAt >= this.config.lifetimeMs || this.y < -80 || this.y > 760) {
      this.destroy();
      return;
    }

    if (this.config.rotationSpeed !== 0) {
      this.rotation += this.config.rotationSpeed * 16.67;
    }
    if (time - this.lastTrailAt >= 85) {
      this.lastTrailAt = time;
      const trail = this.scene.add
        .image(this.x, this.y, this.texture.key)
        .setDisplaySize(this.displayWidth * 0.9, this.displayHeight * 0.9)
        .setRotation(this.rotation)
        .setDepth(26)
        .setAlpha(0.22)
        .setBlendMode(Phaser.BlendModes.ADD);
      this.scene.tweens.add({
        targets: trail,
        alpha: 0,
        scaleX: trail.scaleX * 0.75,
        scaleY: trail.scaleY * 0.75,
        duration: 190,
        onComplete: () => trail.destroy(),
      });
    }
  }
}
