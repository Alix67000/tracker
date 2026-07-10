import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, BarChart3 } from 'lucide-react';

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] h-[76px] bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center z-50 pb-2 px-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${isActive ? 'text-blue-500 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`
        }
      >
        <Home size={20} strokeWidth={2} />
        <span className="text-[10px] font-medium">Aujourd'hui</span>
      </NavLink>
      <NavLink
        to="/manage"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${isActive ? 'text-blue-500 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`
        }
      >
        <Dumbbell size={20} strokeWidth={2} />
        <span className="text-[10px] font-medium">Programmes</span>
      </NavLink>
      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${isActive ? 'text-blue-500 bg-blue-50' : 'text-slate-400 hover:text-slate-600'}`
        }
      >
        <BarChart3 size={20} strokeWidth={2} />
        <span className="text-[10px] font-medium">Stats</span>
      </NavLink>
    </nav>
  );
}
