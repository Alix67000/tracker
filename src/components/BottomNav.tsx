import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-text">Aujourd'hui</span>
      </NavLink>
      <NavLink 
        to="/manage" 
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <span className="nav-icon">➕</span>
        <span className="nav-text">Entraînements</span>
      </NavLink>
      <NavLink 
        to="/stats" 
        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-text">Stats</span>
      </NavLink>
    </nav>
  );
}
