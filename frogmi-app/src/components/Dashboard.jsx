import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FEEDS, PERIODS, fetchFeed } from '../services/usgs';
import { fmtMag, magColor, magLabel, timeAgo } from '../utils';
import Header from './Header';
import QuakeMap from './QuakeMap';
import StatsBar from './StatsBar';

const REFRESH_MS = 60000;
const LIST_LIMIT = 200;

export default function Dashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('day');
  const [feed, setFeed] = useState('all');
  const [minMag, setMinMag] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('time');
  const [quakes, setQuakes] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [updated, setUpdated] = useState(null);
  const [selected, setSelected] = useState(null);
  const [focus, setFocus] = useState(null);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(Date.now());
  const knownIds = useRef(null);

  // The unfiltered 30-day feed is ~10k events; cap it at M1+.
  const effectiveFeed = period === 'month' && feed === 'all' ? '1.0' : feed;

  useEffect(() => {
    const ctrl = new AbortController();
    knownIds.current = null;

    const load = (initial) => {
      if (initial) setStatus('loading');
      fetchFeed(effectiveFeed, period, ctrl.signal)
        .then(({ quakes: list, generated }) => {
          if (knownIds.current) {
            const fresh = list.filter((q) => !knownIds.current.has(q.id));
            if (fresh.length === 1) setToast(`New M${fmtMag(fresh[0].magnitude)} — ${fresh[0].place}`);
            else if (fresh.length > 1) setToast(`${fresh.length} new earthquakes detected`);
          }
          knownIds.current = new Set(list.map((q) => q.id));
          setQuakes(list);
          setUpdated(generated);
          setStatus('ready');
        })
        .catch((e) => {
          if (e.name !== 'AbortError' && initial) setStatus('error');
        });
    };

    load(true);
    const timer = setInterval(() => load(false), REFRESH_MS);
    return () => {
      ctrl.abort();
      clearInterval(timer);
    };
  }, [effectiveFeed, period]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = quakes.filter((q) => (q.magnitude ?? 0) >= minMag && (!term || q.place.toLowerCase().includes(term)));
    return list.sort((a, b) => (sort === 'mag' ? (b.magnitude ?? -9) - (a.magnitude ?? -9) : b.time - a.time));
  }, [quakes, minMag, search, sort]);

  const open = (q) => navigate(`/quake/${q.id}`);

  return (
    <div className="page">
      <Header live={period === 'hour' || period === 'day'} updated={updated} now={now} />

      <section className="controls">
        <div className="seg" role="group" aria-label="Time window">
          {PERIODS.map((p) => (
            <button key={p.id} className={p.id === period ? 'on' : ''} onClick={() => setPeriod(p.id)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="seg" role="group" aria-label="Magnitude feed">
          {FEEDS.map((f) => (
            <button
              key={f.id}
              className={f.id === effectiveFeed ? 'on' : ''}
              disabled={period === 'month' && f.id === 'all'}
              onClick={() => setFeed(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="slider">
          <span>
            Min M <b>{minMag.toFixed(1)}</b>
          </span>
          <input type="range" min="0" max="7" step="0.5" value={minMag} onChange={(e) => setMinMag(Number(e.target.value))} />
        </label>
        <input
          className="search"
          type="search"
          placeholder="Filter by place… (e.g. Alaska, Chile)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {status === 'error' && <div className="alert">Couldn't reach the USGS feed. Retrying automatically every minute.</div>}

      <StatsBar quakes={visible} />

      <section className="board">
        <div className="panel panel--map">
          {status === 'loading' && (
            <div className="scan">
              <span />
              Scanning seismic networks…
            </div>
          )}
          <QuakeMap quakes={visible} selected={selected} focus={focus} onSelect={open} />
          <div className="legend">
            {[1, 3, 4.5, 5.5, 6.5].map((m) => (
              <span key={m}>
                <i style={{ background: magColor(m) }} />
                {magLabel(m)}
              </span>
            ))}
          </div>
        </div>

        <div className="panel panel--list">
          <div className="list__head">
            <span>
              {visible.length.toLocaleString()} events
              {visible.length > LIST_LIMIT && <small className="muted"> · showing {LIST_LIMIT}</small>}
            </span>
            <div className="seg seg--sm">
              <button className={sort === 'time' ? 'on' : ''} onClick={() => setSort('time')}>
                Latest
              </button>
              <button className={sort === 'mag' ? 'on' : ''} onClick={() => setSort('mag')}>
                Strongest
              </button>
            </div>
          </div>
          <ul className="list">
            {visible.slice(0, LIST_LIMIT).map((q, i) => (
              <li key={q.id} style={{ animationDelay: `${Math.min(i, 20) * 25}ms` }}>
                <button
                  className={`quake ${q.id === selected ? 'quake--on' : ''}`}
                  onMouseEnter={() => setSelected(q.id)}
                  onFocus={() => setSelected(q.id)}
                  onClick={() => open(q)}
                >
                  <span className={`mag ${q.magnitude >= 4.5 ? 'mag--hot' : ''}`} style={{ '--c': magColor(q.magnitude) }}>
                    {fmtMag(q.magnitude)}
                  </span>
                  <span className="quake__body">
                    <strong>{q.place}</strong>
                    <small>
                      {timeAgo(q.time, now)} · {q.depth?.toFixed(1)} km deep
                      {q.tsunami ? ' · 🌊 tsunami' : ''}
                    </small>
                  </span>
                </button>
                <button
                  className="locate"
                  title="Locate on map"
                  aria-label="Locate on map"
                  onClick={() => {
                    setSelected(q.id);
                    setFocus({ ...q });
                  }}
                >
                  ◎
                </button>
              </li>
            ))}
          </ul>
          {status === 'ready' && visible.length === 0 && (
            <p className="empty">No earthquakes match these filters. The planet is (briefly) calm.</p>
          )}
        </div>
      </section>

      {toast && (
        <div className="toast" role="status">
          📡 {toast}
        </div>
      )}

      <footer className="footer">
        Live data: USGS Earthquake Hazards Program · Rails API + React · Map © OpenStreetMap / CARTO
      </footer>
    </div>
  );
}
