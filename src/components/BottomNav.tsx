import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, BarChart3 } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] h-16 bg-white border-t border-slate-100 flex items-center justify-around px-4">
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`}
      >
        <Home size={24} strokeWidth={2} />
        Aujourd'hui
      </NavLink>
      <NavLink 
        to="/manage" 
        className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`}
      >
        <Dumbbell size={24} strokeWidth={2} />
        Programmes
      </NavLink>
      <NavLink 
        to="/stats" 
        className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-colors ${isActive ? 'text-blue-500' : 'text-slate-400'}`}
      >
        <BarChart3 size={24} strokeWidth={2} />
        Stats
      </NavLink>
    </nav>
  );
}
