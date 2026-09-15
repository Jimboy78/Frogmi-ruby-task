import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchEvent, fetchNearby } from '../services/usgs';
import { fmtMag, magColor, magLabel, timeAgo } from '../utils';
import Header from './Header';
import QuakeMap from './QuakeMap';
import Comments from './Comments';

const ALERT_COLORS = { green: '#22c55e', yellow: '#facc15', orange: '#fb923c', red: '#ef4444' };
const MANTLE_DEPTH_KM = 700;

export default function QuakeDetail() {
  const { id } = useParams();
  const [quake, setQuake] = useState(null);
  const [nearby, setNearby] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setQuake(null);
    setNearby(null);
    setError(null);
    fetchEvent(id, ctrl.signal)
      .then((q) => {
        setQuake(q);
        fetchNearby(q, ctrl.signal)
          .then(setNearby)
          .catch((e) => e.name !== 'AbortError' && setNearby([]));
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      });
    return () => ctrl.abort();
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <Header />
        <div className="empty">
          <p>Could not load this event ({error}).</p>
          <Link className="btn" to="/">
            ← Back to live map
          </Link>
        </div>
      </div>
    );
  }

  if (!quake) {
    return (
      <div className="page">
        <Header />
        <div className="scan scan--page">
          <span />
          Locating epicenter…
        </div>
      </div>
    );
  }

  const color = magColor(quake.magnitude);
  const depthPct = Math.min(100, ((quake.depth ?? 0) / MANTLE_DEPTH_KM) * 100);
  const facts = [
    ['Depth', `${quake.depth?.toFixed(1)} km`],
    ['Coordinates', `${quake.latitude.toFixed(3)}, ${quake.longitude.toFixed(3)}`],
    ['Felt reports', quake.felt ?? 0],
    ['Significance', quake.sig ?? '—'],
    ['Intensity (MMI)', quake.mmi ? quake.mmi.toFixed(1) : '—'],
    ['Review status', quake.status],
  ];

  return (
    <div className="page">
      <Header />
      <Link to="/" className="back">
        ← Live map
      </Link>

      <section className="hero" style={{ '--c': color }}>
        <div className="hero__mag">
          <span className="hero__ring" />
          <span className="hero__ring hero__ring--2" />
          <strong>{fmtMag(quake.magnitude)}</strong>
          <small>{quake.magType?.toUpperCase()}</small>
        </div>
        <div className="hero__info">
          <div className="chips">
            <span className="chip" style={{ '--c': color }}>
              {magLabel(quake.magnitude ?? 0)}
            </span>
            {quake.alert && (
              <span className="chip" style={{ '--c': ALERT_COLORS[quake.alert] }}>
                PAGER {quake.alert}
              </span>
            )}
            {quake.tsunami && (
              <span className="chip" style={{ '--c': '#38bdf8' }}>
                🌊 Tsunami flag
              </span>
            )}
          </div>
          <h1>{quake.place}</h1>
          <p className="muted">
            {new Date(quake.time).toLocaleString()} · {timeAgo(quake.time)}
          </p>
          <a className="btn" href={quake.url} target="_blank" rel="noreferrer">
            USGS event page ↗
          </a>
        </div>
      </section>

      <section className="detail-grid">
        <div className="panel panel--map panel--mini">
          <QuakeMap quakes={[...(nearby ?? []), quake]} selected={quake.id} center={[quake.latitude, quake.longitude]} zoom={6} />
        </div>
        <div className="panel">
          <h2 className="panel__title">Event data</h2>
          <div className="facts">
            {facts.map(([label, value]) => (
              <div key={label} className="fact">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <div className="depth">
            <div className="depth__labels">
              <span>Surface</span>
              <span>Upper mantle · {MANTLE_DEPTH_KM} km</span>
            </div>
            <div className="depth__track">
              <span className="depth__crust" title="Continental crust ~35 km" />
              <span className="depth__marker" style={{ left: `${depthPct}%`, '--c': color }} />
            </div>
          </div>
        </div>
      </section>

      <section className="detail-grid">
        <div className="panel">
          <h2 className="panel__title">Nearby activity · 250 km · 30 days</h2>
          {!nearby && (
            <div className="scan scan--inline">
              <span />
              Querying catalog…
            </div>
          )}
          {nearby && nearby.length === 0 && <p className="muted">No other events recorded nearby.</p>}
          {nearby && nearby.length > 0 && (
            <ul className="list list--compact">
              {nearby.slice(0, 12).map((n) => (
                <li key={n.id}>
                  <Link className="quake" to={`/quake/${n.id}`}>
                    <span className="mag" style={{ '--c': magColor(n.magnitude) }}>
                      {fmtMag(n.magnitude)}
                    </span>
                    <span className="quake__body">
                      <strong>{n.place}</strong>
                      <small>{timeAgo(n.time)}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Comments quakeId={quake.id} />
      </section>
    </div>
  );
}
