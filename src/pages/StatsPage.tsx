import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { getTodayISO, getDayOfWeek, getWeekStart, addDays } from '../utils/date';
import StatCard from '../components/StatCard';
import MiniChart from '../components/MiniChart';

export default function StatsPage() {
  const { workouts, completions } = useApp();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  const stats = useMemo(() => {
    const today = getTodayISO();
    
    // 1. Streak
    let streak = 0;
    let tempDate = today;
    const hasCompletionsToday = completions.some(c => c.date === tempDate && c.completed);
    if (!hasCompletionsToday) {
      tempDate = addDays(tempDate, -1);
    }
    let maxLoops = 3650;
    while(maxLoops > 0) {
      const hasC = completions.some(c => c.date === tempDate && c.completed);
      if (hasC) {
        streak++;
        tempDate = addDays(tempDate, -1);
      } else {
        break;
      }
      maxLoops--;
    }

    // 2. Period Range
    let startDate = today;
    if (period === 'week') {
      startDate = getWeekStart(today);
    } else if (period === 'month') {
      const dObj = new Date();
      const year = dObj.getFullYear();
      const month = String(dObj.getMonth() + 1).padStart(2, '0');
      startDate = `${year}-${month}-01`;
    } else {
      if (workouts.length > 0) {
        let minDate = today;
        workouts.forEach(w => {
          if (w.createdAt) {
            const wDate = w.createdAt.split('T')[0];
            if (wDate < minDate) minDate = wDate;
          }
        });
        startDate = minDate < '2020-01-01' ? '2020-01-01' : minDate;
      }
    }

    // 3. Planned vs Completed
    let plannedCount = 0;
    let completedCount = 0;
    let d = startDate;
    if (d > today) d = today;
    
    let loopMax = 3650;
    while(d <= today && loopMax > 0) {
      const dayOfWeek = getDayOfWeek(d);
      workouts.forEach(w => {
        const wDate = w.createdAt ? w.createdAt.split('T')[0] : '2020-01-01';
        if (wDate <= d && w.daysOfWeek?.includes(dayOfWeek)) {
          plannedCount++;
        }
      });
      const comps = completions.filter(c => c.date === d && c.completed);
      completedCount += comps.length;
      d = addDays(d, 1);
      loopMax--;
    }

    const rate = plannedCount > 0 ? Math.round((completedCount / plannedCount) * 100) : 0;

    // 4. MiniChart
    const chartData = [];
    const dayLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    for (let i = 6; i >= 0; i--) {
      const cd = addDays(today, -i);
      const dw = getDayOfWeek(cd);
      const c = completions.filter(comp => comp.date === cd && comp.completed).length;
      chartData.push({ day: dayLabels[dw], count: c });
    }

    // 5. Workouts Stats
    const workoutsStats = workouts.map(w => {
      let wPlanned = 0;
      let wCompleted = 0;
      
      const wDate = w.createdAt ? w.createdAt.split('T')[0] : '2020-01-01';
      let pd = wDate > startDate ? wDate : startDate;
      if (period === 'all') pd = wDate;
      if (pd > today) pd = today;

      let subLoop = 3650;
      while(pd <= today && subLoop > 0) {
        const dw = getDayOfWeek(pd);
        if (w.daysOfWeek?.includes(dw)) {
          wPlanned++;
          const hasC = completions.some(c => c.workoutId === w.id && c.date === pd && c.completed);
          if (hasC) wCompleted++;
        }
        pd = addDays(pd, 1);
        subLoop--;
      }
      
      const wRate = wPlanned > 0 ? Math.round((wCompleted / wPlanned) * 100) : 0;
      return { ...w, planned: wPlanned, completed: wCompleted, rate: wRate };
    });

    return {
      streak,
      plannedCount,
      completedCount,
      rate,
      chartData,
      workoutsStats
    };
  }, [workouts, completions, period]);

  return (
    <div className="page pb-8">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Statistiques
        </h1>
        <p className="text-slate-400 text-sm">Suivez votre progression</p>
      </header>
      
      <div className="flex bg-slate-200 p-1 rounded-xl mb-6">
        <button onClick={() => setPeriod('week')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${period === 'week' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Semaine</button>
        <button onClick={() => setPeriod('month')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${period === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Mois</button>
        <button onClick={() => setPeriod('all')} className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-colors ${period === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>Tout</button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="col-span-2">
           <StatCard label="Série actuelle" value={stats.streak} unit="jours" icon="🔥" />
        </div>
        <StatCard label="Complétés" value={`${stats.completedCount} / ${stats.plannedCount}`} icon="🎯" />
        <StatCard label="Taux de réussite" value={stats.rate} unit="%" icon="📈" />
      </div>

      <div className="mb-6">
        <MiniChart data={stats.chartData} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Détail par entraînement</h3>
        <div className="space-y-3">
           {stats.workoutsStats.map(ws => (
             <div key={ws.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm fade-in-transition">
               <div className="flex justify-between items-end mb-2">
                 <h4 className="font-bold text-slate-700 text-sm">{ws.name}</h4>
                 <span className="text-xs font-bold text-slate-400">{ws.rate}% ({ws.completed}/{ws.planned})</span>
               </div>
               <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                 <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${ws.rate}%` }}></div>
               </div>
             </div>
           ))}
           {stats.workoutsStats.length === 0 && (
             <p className="text-slate-400 text-sm text-center py-4">Aucune donnée.</p>
           )}
        </div>
      </div>
    </div>
  );
}
