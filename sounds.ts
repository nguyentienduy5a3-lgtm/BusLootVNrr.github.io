let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function play(
  type: OscillatorType,
  freq: number,
  gainVal: number,
  duration: number,
  freqEnd?: number
) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, ac.currentTime + duration);
  }
  gain.gain.setValueAtTime(gainVal, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

export const sounds = {
  click() {
    try { play("sine", 800, 0.15, 0.08, 600); } catch {}
  },
  confirm() {
    try {
      play("sine", 440, 0.12, 0.12, 660);
      setTimeout(() => play("sine", 660, 0.12, 0.12, 880), 80);
    } catch {}
  },
  success() {
    try {
      play("sine", 523, 0.15, 0.15);
      setTimeout(() => play("sine", 659, 0.15, 0.15), 120);
      setTimeout(() => play("sine", 784, 0.18, 0.25), 240);
    } catch {}
  },
  capsule(rarity: string) {
    try {
      const freqs: Record<string, number[]> = {
        common:     [300, 400],
        uncommon:   [400, 550],
        rare:       [500, 700],
        epic:       [600, 900],
        legendary:  [700, 1100],
        mythic:     [800, 1300],
        secret:     [900, 1500],
        impossible: [500, 1800],
      };
      const [f1, f2] = freqs[rarity] ?? [400, 600];
      play("sawtooth", f1, 0.1, 0.4, f2);
      setTimeout(() => play("sine", f2, 0.2, 0.4), 200);
      if (rarity === "impossible") {
        setTimeout(() => play("sine", 1200, 0.25, 0.6, 2000), 400);
      }
    } catch {}
  },
  spin() {
    try { play("triangle", 200, 0.08, 0.05, 220); } catch {}
  },
  spinEnd() {
    try {
      play("sine", 660, 0.2, 0.3);
      setTimeout(() => play("sine", 880, 0.15, 0.3), 200);
    } catch {}
  },
  cookie() {
    try { play("sine", 1000, 0.12, 0.1, 600); } catch {}
  },
  error() {
    try { play("sawtooth", 200, 0.1, 0.15, 150); } catch {}
  },
  rideStart() {
    try {
      play("sine", 330, 0.12, 0.1);
      setTimeout(() => play("sine", 440, 0.15, 0.15), 100);
    } catch {}
  },
  rideComplete() {
    try {
      [523, 659, 784, 1046].forEach((f, i) => {
        setTimeout(() => play("sine", f, 0.18, 0.2), i * 100);
      });
    } catch {}
  },
};
