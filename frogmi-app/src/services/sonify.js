// Turns earthquakes into sound: stronger events are lower, louder and longer.
let ctx = null;

function audio() {
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    ctx = new Ctx();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** Call from a user gesture so browsers allow playback later. */
export function unlockAudio() {
  audio();
}

export function rumble(magnitude) {
  const m = Math.max(0, Math.min(9, magnitude ?? 0));
  const c = audio();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();

  const base = 70 + (8 - m) * 70;
  osc.type = m >= 5 ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(base * 1.6, t);
  osc.frequency.exponentialRampToValueAtTime(base, t + 0.08);

  const peak = Math.min(0.35, 0.04 + (m / 8) ** 2 * 0.3);
  const duration = 0.25 + m * 0.12;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}
