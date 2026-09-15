import { useEffect, useRef, useState } from 'react';
import { fmtMag, magColor } from '../utils';
import './replay.css';

// Seconds the whole time window takes to play back.
export const SPEEDS = [
  { secs: 60, label: 'Slow' },
  { secs: 25, label: 'Normal' },
  { secs: 10, label: 'Fast' },
];

const fmtClock = (ms) =>
  new Date(ms).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

/** One column per pixel: a damped burst per quake, colored by the strongest event under it. */
function buildTrace(quakes, start, end, width) {
  const amp = new Float32Array(width);
  const mag = new Float32Array(width).fill(-9);
  const span = Math.max(1, end - start);

  for (const q of quakes) {
    if (q.magnitude == null) continue;
    const m = q.magnitude;
    const x0 = Math.floor(((q.time - start) / span) * (width - 1));
    const a = Math.min(1, Math.max(0.06, (m + 1) / 8) ** 2.2);
    const len = Math.round(5 + Math.max(0, m) * 5);
    for (let i = 0; i < len; i++) {
      const x = x0 + i;
      if (x < 0 || x >= width) continue;
      const env = Math.exp((-3 * i) / len);
      const v = a * env * (0.55 + 0.45 * Math.abs(Math.sin(i * 1.7 + m)));
      if (v > amp[x]) amp[x] = v;
      if (env > 0.25 && m > mag[x]) mag[x] = m;
    }
  }
  return { amp, mag };
}

function paint(canvas, { amp, mag }, width, height) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const mid = height / 2;
  for (let x = 0; x < width; x++) {
    // Deterministic background tremor so quiet stretches still look like a live trace.
    const noise = 0.012 + 0.018 * Math.abs((Math.sin(x * 12.9898) * 43758.5453) % 1);
    const h = Math.max(0.5, Math.max(amp[x], noise) * (mid - 3));
    ctx.fillStyle = mag[x] > -9 ? magColor(mag[x]) : 'rgba(34, 211, 238, 0.55)';
    ctx.fillRect(x, mid - h, 1, h * 2);
  }
}

export default function Replay({
  quakes,
  start,
  end,
  t,
  playing,
  speed,
  sound,
  shownCount,
  total,
  latest,
  onPlay,
  onSeek,
  onSpeed,
  onSound,
  onClose,
}) {
  const wrapRef = useRef(null);
  const dimRef = useRef(null);
  const brightRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) =>
      setSize({ w: Math.floor(entry.contentRect.width), h: Math.floor(entry.contentRect.height) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!size.w || !size.h) return;
    const trace = buildTrace(quakes, start, end, size.w);
    paint(dimRef.current, trace, size.w, size.h);
    paint(brightRef.current, trace, size.w, size.h);
  }, [quakes, start, end, size]);

  const progress = end > start ? Math.min(1, Math.max(0, (t - start) / (end - start))) : 0;
  const pct = `${(progress * 100).toFixed(2)}%`;

  return (
    <section className="replay" aria-label="Seismic replay">
      <div className="replay__bar">
        <button
          className={`replay__play ${playing ? 'is-playing' : ''}`}
          onClick={onPlay}
          aria-label={playing ? 'Pause replay' : 'Play replay'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <div className="replay__clock">
          <small>Replay</small>
          <b>{fmtClock(t)}</b>
        </div>
        <div className="replay__count">
          <b>{shownCount.toLocaleString()}</b> / {total.toLocaleString()} events
        </div>
        {latest && (
          <div className="replay__latest" key={latest.id}>
            <span className="replay__chip" style={{ '--c': magColor(latest.magnitude) }}>
              M{fmtMag(latest.magnitude)}
            </span>
            <span>{latest.place}</span>
          </div>
        )}
        <div className="replay__tools">
          <div className="seg seg--sm" role="group" aria-label="Replay speed">
            {SPEEDS.map((s) => (
              <button key={s.secs} className={s.secs === speed ? 'on' : ''} onClick={() => onSpeed(s.secs)}>
                {s.label}
              </button>
            ))}
          </div>
          <button
            className={`replay__icon ${sound ? 'on' : ''}`}
            onClick={onSound}
            aria-label={sound ? 'Mute sonification' : 'Hear the earthquakes'}
            title={sound ? 'Mute' : 'Hear the earthquakes'}
          >
            {sound ? '🔊' : '🔇'}
          </button>
          <button className="replay__icon" onClick={onClose} aria-label="Exit replay" title="Exit replay">
            ✕
          </button>
        </div>
      </div>

      <div className="seismo" ref={wrapRef}>
        <canvas ref={dimRef} className="seismo__trace seismo__trace--dim" aria-hidden="true" />
        <div className="seismo__played" style={{ width: pct }}>
          <canvas ref={brightRef} className="seismo__trace" aria-hidden="true" />
        </div>
        <div className="seismo__head" style={{ left: pct }} aria-hidden="true" />
        <input
          type="range"
          className="seismo__scrub"
          min={start}
          max={end}
          step="any"
          value={t}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Replay position"
        />
      </div>
      <div className="seismo__ticks">
        <span>{fmtClock(start)}</span>
        <span>{fmtClock((start + end) / 2)}</span>
        <span>{fmtClock(end)}</span>
      </div>
    </section>
  );
}
