/**
 * Ambient Islamic Lullaby / Harp Melodic Synthesizer
 * Plays a soothing, peaceful melody (inspired by traditional peaceful tones & Sholawat)
 * using Web Audio API so it plays instantly and reliably on any device without external network downloads.
 */

class MusicPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private noteIndex: number = 0;
  private listeners: ((playing: boolean) => void)[] = [];

  // Gentle pentatonic peaceful melody notes in Hz (Eb Major / peaceful pentatonic scale)
  private melody = [
    // Phrase 1
    { note: 311.13, duration: 0.9 }, // Eb4
    { note: 349.23, duration: 0.9 }, // F4
    { note: 392.00, duration: 1.2 }, // G4
    { note: 466.16, duration: 1.4 }, // Bb4
    { note: 392.00, duration: 1.0 }, // G4
    { note: 349.23, duration: 1.6 }, // F4
    { note: 311.13, duration: 2.0 }, // Eb4
    { note: 0, duration: 0.4 },      // rest

    // Phrase 2
    { note: 392.00, duration: 0.9 }, // G4
    { note: 466.16, duration: 0.9 }, // Bb4
    { note: 523.25, duration: 1.4 }, // C5
    { note: 466.16, duration: 1.0 }, // Bb4
    { note: 392.00, duration: 1.2 }, // G4
    { note: 349.23, duration: 1.8 }, // F4
    { note: 0, duration: 0.4 },

    // Phrase 3 - gentle octave ascent
    { note: 466.16, duration: 0.8 }, // Bb4
    { note: 523.25, duration: 0.8 }, // C5
    { note: 622.25, duration: 1.6 }, // Eb5
    { note: 523.25, duration: 1.0 }, // C5
    { note: 466.16, duration: 1.2 }, // Bb4
    { note: 392.00, duration: 1.8 }, // G4
    { note: 311.13, duration: 2.2 }, // Eb4
    { note: 0, duration: 0.6 },
  ];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  public async play(): Promise<boolean> {
    try {
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (this.isPlaying) return true;
      this.isPlaying = true;
      this.notify();
      this.scheduleNextNote();
      return true;
    } catch {
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      void this.play();
    }
  }

  public getPlaying(): boolean {
    return this.isPlaying;
  }

  private scheduleNextNote() {
    if (!this.isPlaying) return;

    const ctx = this.getContext();
    const current = this.melody[this.noteIndex % this.melody.length];
    this.noteIndex = (this.noteIndex + 1) % this.melody.length;

    if (current.note > 0) {
      this.playPluck(current.note, current.duration);
    }

    const intervalMs = current.duration * 900;
    this.timerId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, intervalMs);
  }

  private playPluck(freq: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Dual oscillator for rich, warm acoustic bell/kalimba/harp timbre
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now); // soft sparkle harmonic

    // Sub oscillator for gentle soothing warmth
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq / 2, now);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.08, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.9);

    // Envelope
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.18, now + 0.05); // quick soft attack
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5); // long gentle decay

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    subOsc.start(now);

    osc1.stop(now + duration * 1.6);
    osc2.stop(now + duration * 1.6);
    subOsc.stop(now + duration * 1.6);
  }
}

export const bgMusicPlayer = new MusicPlayer();
