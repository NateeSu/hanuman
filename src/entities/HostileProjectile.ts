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
  facesLeft?: boolean;
  rotateToVelocity?: boolean;
  homingStrength?: number;
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
  "shield-disc": {
    texture: "projectile-shield-disc",
    speed: PROJECTILE_SPEED["shield-disc"],
    width: 138,
    height: 138,
    lifetimeMs: 2800,
    damageDelayMs: 100,
    rotationSpeed: 0.016,
    collidesWithTerrain: false,
    rotateToVelocity: false,
  },
  "tusk-wave": {
    texture: "projectile-tusk-wave",
    speed: PROJECTILE_SPEED["tusk-wave"],
    width: 178,
    height: 62,
    lifetimeMs: 2500,
    damageDelayMs: 100,
    rotationSpeed: 0,
    collidesWithTerrain: false,
    rotateToVelocity: false,
  },
  "magma-boulder": {
    texture: "projectile-magma-boulder",
    speed: PROJECTILE_SPEED["magma-boulder"],
    width: 96,
    height: 82,
    lifetimeMs: 3000,
    damageDelayMs: 80,
    rotationSpeed: 0.006,
    collidesWithTerrain: true,
    rotateToVelocity: false,
  },
  "lotus-stinger": {
    texture: "projectile-lotus-stinger",
    speed: PROJECTILE_SPEED["lotus-stinger"],
    width: 156,
    height: 56,
    lifetimeMs: 2600,
    damageDelayMs: 60,
    rotationSpeed: 0,
    collidesWithTerrain: true,
    facesLeft: true,
  },
  "chain-sigil": {
    texture: "projectile-chain-sigil",
    speed: PROJECTILE_SPEED["chain-sigil"],
    width: 100,
    height: 89,
    lifetimeMs: 3000,
    damageDelayMs: 90,
    rotationSpeed: 0.005,
    collidesWithTerrain: true,
    rotateToVelocity: false,
  },
  "tidal-trident": {
    texture: "projectile-tidal-trident",
    speed: PROJECTILE_SPEED["tidal-trident"],
    width: 210,
    height: 96,
    lifetimeMs: 2400,
    damageDelayMs: 70,
    rotationSpeed: 0,
    collidesWithTerrain: true,
  },
  "hypnosis-orb": {
    texture: "projectile-hypnosis-orb",
    speed: PROJECTILE_SPEED["hypnosis-orb"],
    width: 132,
    height: 132,
    lifetimeMs: 4000,
    damageDelayMs: 160,
    rotationSpeed: 0.004,
    collidesWithTerrain: false,
    rotateToVelocity: false,
    homingStrength: 0.026,
  },
};

export class HostileProjectile extends Phaser.Physics.Arcade.Image {
  private readonly config: ProjectileConfig;
  private readonly startedAt: number;
  private lastTrailAt = -9999;

  constructor(
    scene: Phaser.Scene,
    payload: HostileProjectilePayload,
    private readonly player: Player,
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
    if (config.rotateToVelocity !== false) {
      this.setRotation(
        Math.atan2(velocity.y, velocity.x) - (config.facesLeft ? Math.PI : 0),
      );
    }

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
    if (this.config.homingStrength && this.player.active) {
      const body = this.body as Phaser.Physics.Arcade.Body;
      const currentAngle = Math.atan2(body.velocity.y, body.velocity.x);
      const targetAngle = Phaser.Math.Angle.Between(
        this.x,
        this.y,
        this.player.x,
        this.player.y - 66,
      );
      const nextAngle = Phaser.Math.Angle.RotateTo(
        currentAngle,
        targetAngle,
        this.config.homingStrength,
      );
      body.setVelocity(
        Math.cos(nextAngle) * this.config.speed,
        Math.sin(nextAngle) * this.config.speed,
      );
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
