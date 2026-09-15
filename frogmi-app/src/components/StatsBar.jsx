import { fmtMag, magColor } from '../utils';

// [from, to, label]
const BUCKETS = [
  [-5, 1, '<1'],
  [1, 2, '1'],
  [2, 3, '2'],
  [3, 4, '3'],
  [4, 5, '4'],
  [5, 6, '5'],
  [6, 11, '6+'],
];

export default function StatsBar({ quakes }) {
  const strongest = quakes.reduce((best, q) => ((q.magnitude ?? -9) > (best?.magnitude ?? -9) ? q : best), null);
  const tsunami = quakes.filter((q) => q.tsunami).length;
  const withDepth = quakes.filter((q) => q.depth != null);
  const avgDepth = withDepth.length ? withDepth.reduce((s, q) => s + q.depth, 0) / withDepth.length : 0;
  const felt = quakes.reduce((s, q) => s + (q.felt || 0), 0);
  const counts = BUCKETS.map(([lo, hi]) => quakes.filter((q) => q.magnitude != null && q.magnitude >= lo && q.magnitude < hi).length);
  const max = Math.max(1, ...counts);
  const strongColor = magColor(strongest?.magnitude);

  return (
    <section className="stats">
      <div className="stat">
        <span className="stat__label">Events</span>
        <strong className="stat__value">{quakes.length.toLocaleString()}</strong>
      </div>
      <div className="stat" style={{ '--c': strongColor }}>
        <span className="stat__label">Strongest</span>
        <strong className="stat__value" style={{ color: strongColor }}>
          M{fmtMag(strongest?.magnitude)}
        </strong>
        <span className="stat__sub">{strongest?.place ?? '—'}</span>
      </div>
      <div className="stat">
        <span className="stat__label">Avg depth</span>
        <strong className="stat__value">
          {avgDepth.toFixed(1)}
          <small> km</small>
        </strong>
      </div>
      <div className="stat">
        <span className="stat__label">Felt reports</span>
        <strong className="stat__value">{felt.toLocaleString()}</strong>
        <span className="stat__sub">
          {tsunami} tsunami flag{tsunami === 1 ? '' : 's'}
        </span>
      </div>
      <div className="stat stat--hist">
        <span className="stat__label">Magnitude distribution</span>
        <div className="hist">
          {counts.map((c, i) => (
            <div key={BUCKETS[i][2]} className="hist__col" title={`${c} events`}>
              <span className="hist__count">{c}</span>
              <span
                className="hist__bar"
                style={{ height: `${(c / max) * 100}%`, background: magColor(BUCKETS[i][0] + 0.5), animationDelay: `${i * 60}ms` }}
              />
              <span className="hist__label">{BUCKETS[i][2]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
