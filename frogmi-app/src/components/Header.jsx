import { Link } from 'react-router-dom';
import SeismoLogo from './SeismoLogo';
import { timeAgo } from '../utils';

export default function Header({ live, updated, now }) {
  return (
    <header className="header">
      <Link to="/" className="brand">
        <SeismoLogo size={44} />
        <span>
          <b>SEISMIC</b>
          <small>Live earthquake monitor</small>
        </span>
      </Link>
      {updated !== undefined && (
        <div className="header__status">
          {live && (
            <span className="live">
              <i />
              LIVE
            </span>
          )}
          {updated && <span className="muted">Updated {timeAgo(updated, now)}</span>}
        </div>
      )}
    </header>
  );
}
