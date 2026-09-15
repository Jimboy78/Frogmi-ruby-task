import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { fmtMag, magColor } from '../utils';

const pulseIcon = (color, size) =>
  L.divIcon({
    className: 'pulse-icon',
    html: `<span style="--c:${color};--s:${size}px"></span>`,
    iconSize: [size, size],
  });

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.latitude, target.longitude], Math.max(map.getZoom(), 5), { duration: 1.2 });
  }, [target, map]);
  return null;
}

export default function QuakeMap({ quakes, selected, focus, onSelect, center = [20, 0], zoom = 2 }) {
  // Animated shockwaves only for the strongest events, to keep the map readable.
  const strong = quakes.filter((q) => q.magnitude >= 4.5).slice(0, 40);

  return (
    <MapContainer center={center} zoom={zoom} minZoom={2} worldCopyJump preferCanvas className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {quakes.map((q) => {
        const isSelected = q.id === selected;
        const color = magColor(q.magnitude);
        return (
          <CircleMarker
            key={q.id}
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
      })}
      {strong.map((q) => (
        <Marker
          key={`pulse-${q.id}`}
          position={[q.latitude, q.longitude]}
          icon={pulseIcon(magColor(q.magnitude), 18 + q.magnitude * 6)}
          interactive={false}
        />
      ))}
      <FlyTo target={focus} />
    </MapContainer>
  );
}
