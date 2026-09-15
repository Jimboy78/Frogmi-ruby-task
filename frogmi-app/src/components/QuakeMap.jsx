import { memo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fmtMag, magColor } from '../utils';

// Icons are cached so re-renders (e.g. every replay tick) don't swap the DOM and restart animations.
const iconCache = new Map();

function cachedIcon(kind, color, rawSize) {
  const size = Math.round(rawSize);
  const key = `${kind}|${color}|${size}`;
  if (!iconCache.has(key)) {
    const ring = `<span style="--c:${color};--s:${size}px"></span>`;
    iconCache.set(
      key,
      L.divIcon({ className: `${kind}-icon`, html: kind === 'ripple' ? ring + ring : ring, iconSize: [size, size] }),
    );
  }
  return iconCache.get(key);
}

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.latitude, target.longitude], Math.max(map.getZoom(), 5), { duration: 1.2 });
  }, [target, map]);
  return null;
}

// Memoized so thousands of markers don't call setStyle on every parent render.
const QuakeDot = memo(function QuakeDot({ quake: q, isSelected, onSelect }) {
  const color = magColor(q.magnitude);
  return (
    <CircleMarker
      center={[q.latitude, q.longitude]}
      radius={Math.max(2.5, (q.magnitude ?? 0) * 2.4)}
      pathOptions={{
        color: isSelected ? '#ffffff' : color,
        weight: isSelected ? 2.5 : 1,
        fillColor: color,
        fillOpacity: isSelected ? 0.9 : 0.55,
      }}
      eventHandlers={{ click: () => onSelect && onSelect(q) }}
    >
      <Tooltip direction="top" offset={[0, -4]}>
        <b>M{fmtMag(q.magnitude)}</b> {q.place}
      </Tooltip>
    </CircleMarker>
  );
});

export default function QuakeMap({ quakes, selected, focus, onSelect, ripples, center = [20, 0], zoom = 2 }) {
  // Looping shockwaves only for the strongest events; replay shows one-shot ripples instead.
  const strong = ripples ? [] : quakes.filter((q) => q.magnitude >= 4.5).slice(0, 40);

  return (
    <MapContainer center={center} zoom={zoom} minZoom={2} worldCopyJump preferCanvas className="map">
      <TileLayer
        attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
        maxZoom={16}
      />
      {quakes.map((q) => (
        <QuakeDot key={q.id} quake={q} isSelected={q.id === selected} onSelect={onSelect} />
      ))}
      {strong.map((q) => (
        <Marker
          key={`pulse-${q.id}`}
          position={[q.latitude, q.longitude]}
          icon={cachedIcon('pulse', magColor(q.magnitude), 18 + q.magnitude * 6)}
          interactive={false}
        />
      ))}
      {ripples &&
        ripples.map((q) => (
          <Marker
            key={`ripple-${q.id}`}
            position={[q.latitude, q.longitude]}
            icon={cachedIcon('ripple', magColor(q.magnitude), 22 + Math.max(0, q.magnitude ?? 0) * 10)}
            interactive={false}
          />
        ))}
      <FlyTo target={focus} />
    </MapContainer>
  );
}
