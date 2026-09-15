export const magColor = (m) => {
  if (m == null) return '#64748b';
  if (m < 2.5) return '#34d399';
  if (m < 4) return '#facc15';
  if (m < 5) return '#fb923c';
  if (m < 6) return '#f43f5e';
  return '#e879f9';
};

export const magLabel = (m) => {
  if (m < 2.5) return 'Micro';
  if (m < 4) return 'Minor';
  if (m < 5) return 'Light';
  if (m < 6) return 'Moderate';
  if (m < 7) return 'Strong';
  return 'Major';
};

export const fmtMag = (m) => (m == null ? '–' : m.toFixed(1));

export function timeAgo(ms, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
