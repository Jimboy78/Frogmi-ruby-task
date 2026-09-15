// Live data straight from the USGS Earthquake Hazards Program (CORS-enabled GeoJSON feeds).
const BASE = 'https://earthquake.usgs.gov';

export const PERIODS = [
  { id: 'hour', label: '1H' },
  { id: 'day', label: '24H' },
  { id: 'week', label: '7D' },
  { id: 'month', label: '30D' },
];

export const FEEDS = [
  { id: 'all', label: 'All' },
  { id: '1.0', label: 'M1+' },
  { id: '2.5', label: 'M2.5+' },
  { id: '4.5', label: 'M4.5+' },
  { id: 'significant', label: 'Significant' },
];

export function normalize(feature) {
  const p = feature.properties;
  const [longitude, latitude, depth] = feature.geometry?.coordinates ?? [];
  return {
    id: feature.id,
    magnitude: p.mag,
    place: p.place || p.title || 'Unknown location',
    time: p.time,
    url: p.url,
    tsunami: p.tsunami === 1,
    magType: p.magType,
    title: p.title,
    longitude,
    latitude,
    depth,
    felt: p.felt,
    alert: p.alert,
    sig: p.sig,
    status: p.status,
    mmi: p.mmi,
  };
}

async function getJson(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`USGS responded ${res.status}`);
  return res.json();
}

export async function fetchFeed(feed, period, signal) {
  const data = await getJson(`${BASE}/earthquakes/feed/v1.0/summary/${feed}_${period}.geojson`, signal);
  return {
    quakes: data.features.filter((f) => f.geometry).map(normalize),
    generated: data.metadata.generated,
  };
}

export async function fetchEvent(id, signal) {
  const data = await getJson(`${BASE}/fdsnws/event/1/query?eventid=${encodeURIComponent(id)}&format=geojson`, signal);
  return normalize(data);
}

export async function fetchNearby(quake, signal) {
  const start = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const params = `format=geojson&latitude=${quake.latitude}&longitude=${quake.longitude}&maxradiuskm=250&starttime=${start}&orderby=time&limit=25`;
  const data = await getJson(`${BASE}/fdsnws/event/1/query?${params}`, signal);
  return data.features.map(normalize).filter((n) => n.id !== quake.id);
}
