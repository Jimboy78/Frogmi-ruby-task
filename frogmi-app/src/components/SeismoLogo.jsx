export default function SeismoLogo({ size = 40 }) {
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" className="logo__ring" />
      <circle cx="24" cy="24" r="22" className="logo__pulse" />
      <polyline className="logo__wave" points="4,24 12,24 15,18 18,30 21,8 25,40 28,16 31,28 34,22 37,24 44,24" />
    </svg>
  );
}
