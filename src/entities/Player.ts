import Phaser from "phaser";
import { audioDirector } from "../audio/AudioDirector";
import { createNormalAttack } from "../systems/playerAttack";
import { touchInput } from "../systems/touchInput";
import {
  TRISHULA_TOTAL_MS,
  TRISHULA_WIND_COST,
  type TrishulaCastOrigin,
} from "../systems/trishulaUltimate";

export interface PlayerStats {
  health: number;
  wind: number;
  damageTaken: number;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  readonly stats: PlayerStats = { health: 100, wind: 70, damageTaken: 0 };
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: Record<"left" | "right" | "jump" | "attack" | "skill" | "dash", Phaser.Input.Keyboard.Key>;
  private lastGroundedAt = 0;
  private jumpQueuedAt = -9999;
  private jumpsUsed = 0;
  private dashReadyAt = 0;
  private dashEndsAt = 0;
  private attackingUntil = 0;
  private ultimateReadyAt = 0;
  private invulnerableUntil = 0;
  private runFrame = false;
  private lastRunFrameAt = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "hanuman-idle");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.42);
    this.setOrigin(0.5, 0.9);
    this.setDepth(20);
    this.setCollideWorldBounds(true);
    this.setDragX(1400);
    this.setMaxVelocity(420, 920);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(150, 260);
    body.setOffset((this.width - 150) / 2, this.height - 265);

    const keyboard = scene.input.keyboard;
    if (!keyboard) throw new Error("Keyboard input is unavailable");
    this.cursors = keyboard.createCursorKeys();
    this.keys = keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      attack: Phaser.Input.Keyboard.KeyCodes.J,
      skill: Phaser.Input.Keyboard.KeyCodes.K,
      dash: Phaser.Input.Keyboard.KeyCodes.L,
    }) as typeof this.keys;
  }

  update(time: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const grounded = body.blocked.down || body.touching.down;
    if (grounded) {
      this.lastGroundedAt = time;
      this.jumpsUsed = 0;
    }

    const left = this.cursors.left.isDown || this.keys.left.isDown || touchInput.isDown("left");
    const right = this.cursors.right.isDown || this.keys.right.isDown || touchInput.isDown("right");
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.keys.jump) ||
      touchInput.justPressed("jump");
    const attackPressed =
      Phaser.Input.Keyboard.JustDown(this.keys.attack) || touchInput.justPressed("attack");
    const skillPressed =
      Phaser.Input.Keyboard.JustDown(this.keys.skill) || touchInput.justPressed("skill");
    const dashPressed =
      Phaser.Input.Keyboard.JustDown(this.keys.dash) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.shift) ||
      touchInput.justPressed("dash");

    if (jumpPressed) this.jumpQueuedAt = time;
    if (time < this.dashEndsAt) {
      body.setAllowGravity(false);
      this.setTexture("hanuman-dash");
      return;
    }
    body.setAllowGravity(true);

    if (left !== right) {
      this.setAccelerationX(left ? -1650 : 1650);
      this.setFlipX(left);
    } else {
      this.setAccelerationX(0);
    }

    if (time - this.jumpQueuedAt < 130) {
      const canFirstJump = time - this.lastGroundedAt < 130;
      const canDoubleJump = !canFirstJump && this.jumpsUsed < 2;
      if (canFirstJump || canDoubleJump) {
        body.setVelocityY(this.jumpsUsed === 0 ? -650 : -610);
        this.jumpsUsed = canFirstJump ? 1 : this.jumpsUsed + 1;
        this.jumpQueuedAt = -9999;
        audioDirector.play("jump");
        this.scene.events.emit("wind-vfx", this.x, this.y + 20, 0x67e8ff);
      }
    }

    if (!this.cursors.space.isDown && !this.keys.jump.isDown && !touchInput.isDown("jump") && body.velocity.y < -220) {
      body.setVelocityY(body.velocity.y * 0.74);
    }

    if (dashPressed && time >= this.dashReadyAt) this.dash(time);
    if (attackPressed && time >= this.attackingUntil) this.attack(time);
    if (
      skillPressed &&
      this.stats.wind >= TRISHULA_WIND_COST &&
      time >= this.ultimateReadyAt
    ) {
      this.skill(time);
    }

    if (time >= this.attackingUntil) this.updateTexture(time, grounded);
  }

  private updateTexture(time: number, grounded: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!grounded) {
      this.setTexture(body.velocity.y < 0 ? "hanuman-jump" : "hanuman-fall");
    } else if (Math.abs(body.velocity.x) > 45) {
      if (time - this.lastRunFrameAt > 120) {
        this.runFrame = !this.runFrame;
        this.lastRunFrameAt = time;
      }
      this.setTexture(this.runFrame ? "hanuman-run-a" : "hanuman-run-b");
    } else {
      this.setTexture("hanuman-idle");
    }
  }

  private dash(time: number): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const direction = this.flipX ? -1 : 1;
    body.setVelocity(direction * 820, 0);
    this.dashEndsAt = time + 180;
    this.dashReadyAt = time + 620;
    this.setTexture("hanuman-dash");
    audioDirector.play("dash");
    this.scene.events.emit("wind-vfx", this.x, this.y, 0x56e6ff);
  }

  private attack(time: number): void {
    const attack = createNormalAttack(this.x, this.y, this.flipX ? -1 : 1);
    this.attackingUntil = time + attack.durationMs;
    this.setTexture("hanuman-attack-1");
    audioDirector.play("attack");
    this.scene.events.emit("player-attack", attack);
  }

  private skill(time: number): void {
    const direction = this.flipX ? -1 : 1;
    const cast: TrishulaCastOrigin = {
      x: this.x + direction * 42,
      y: this.y - 82,
      direction,
    };
    this.stats.wind -= TRISHULA_WIND_COST;
    this.attackingUntil = time + 520;
    this.ultimateReadyAt = time + TRISHULA_TOTAL_MS + 300;
    this.setTexture("hanuman-heavy");
    audioDirector.play("ultimate");
    this.scene.events.emit("trishula-ultimate", cast);
    this.scene.events.emit("wind-vfx", cast.x, cast.y, 0xf6cf63);
    this.emitStats();
  }

  takeDamage(amount: number, sourceX: number): boolean {
    const now = this.scene.time.now;
    if (now < this.invulnerableUntil) return false;
    this.invulnerableUntil = now + 900;
    this.stats.health = Math.max(0, this.stats.health - amount);
    this.stats.damageTaken += amount;
    this.setTexture("hanuman-hurt");
    this.setTint(0xffb7bd);
    this.scene.time.delayedCall(140, () => this.clearTint());
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(sourceX < this.x ? 250 : -250, -270);
    audioDirector.play("hit");
    this.emitStats();
    if (this.stats.health <= 0) this.scene.events.emit("player-defeated");
    return true;
  }

  healAndRestore(): void {
    this.stats.health = 100;
    this.stats.wind = Math.max(50, this.stats.wind);
    this.emitStats();
  }

  addWind(amount: number): void {
    this.stats.wind = Math.min(100, this.stats.wind + amount);
    this.emitStats();
  }

  private emitStats(): void {
    this.scene.events.emit("player-stats", { ...this.stats });
  }
}
