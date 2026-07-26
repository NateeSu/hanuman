import { saveStore } from "../storage/saveStore";

class AudioDirector {
  private context?: AudioContext;
  private master?: GainNode;
  private sfxBus?: GainNode;
  private musicBus?: GainNode;

  unlock(): void {
    if (this.context) return;
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.sfxBus = this.context.createGain();
    this.musicBus = this.context.createGain();
    this.sfxBus.connect(this.master);
    this.musicBus.connect(this.master);
    this.master.connect(this.context.destination);
    this.startAmbientScore();
    this.syncSettings();
  }

  syncSettings(): void {
    if (!this.master || !this.sfxBus || !this.musicBus) return;
    const { muted, sfxVolume, musicVolume } = saveStore.get().settings;
    this.master.gain.value = muted ? 0 : 1;
    this.sfxBus.gain.value = sfxVolume * 0.18;
    this.musicBus.gain.value = musicVolume * 0.035;
  }

  play(kind: "jump" | "attack" | "dash" | "hit" | "collect" | "checkpoint" | "victory"): void {
    this.unlock();
    if (!this.context || !this.sfxBus) return;
    const frequencies = {
      jump: [340, 520],
      attack: [180, 95],
      dash: [580, 260],
      hit: [90, 55],
      collect: [540, 880],
      checkpoint: [330, 660],
      victory: [392, 523],
    } as const;
    const [start, end] = frequencies[kind];
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = kind === "hit" ? "sawtooth" : "sine";
    oscillator.frequency.setValueAtTime(start, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      end,
      this.context.currentTime + (kind === "victory" ? 0.32 : 0.11),
    );
    gain.gain.setValueAtTime(0.8, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.35);
    oscillator.connect(gain);
    gain.connect(this.sfxBus);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.36);
  }

  private startAmbientScore(): void {
    if (!this.context || !this.musicBus) return;
    const root = this.context.createOscillator();
    const fifth = this.context.createOscillator();
    const shimmer = this.context.createOscillator();
    root.type = "sine";
    fifth.type = "triangle";
    shimmer.type = "sine";
    root.frequency.value = 82.41;
    fifth.frequency.value = 123.47;
    shimmer.frequency.value = 329.63;
    const rootGain = this.context.createGain();
    const fifthGain = this.context.createGain();
    const shimmerGain = this.context.createGain();
    rootGain.gain.value = 0.7;
    fifthGain.gain.value = 0.23;
    shimmerGain.gain.value = 0.04;
    root.connect(rootGain).connect(this.musicBus);
    fifth.connect(fifthGain).connect(this.musicBus);
    shimmer.connect(shimmerGain).connect(this.musicBus);
    const lfo = this.context.createOscillator();
    const lfoGain = this.context.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain).connect(shimmerGain.gain);
    root.start();
    fifth.start();
    shimmer.start();
    lfo.start();
  }
}

export const audioDirector = new AudioDirector();
