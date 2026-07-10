import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { getTodayISO, getDayOfWeek, getWeekStart, addDays } from '../utils/date';
import MiniChart from '../components/MiniChart';

const WORKOUT_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-500' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-orange-500' },
  purple: { bg: 'bg-violet-100', text: 'text-violet-600', bar: 'bg-violet-500' },
  red: { bg: 'bg-rose-100', text: 'text-rose-600', bar: 'bg-rose-500' },
};

export default function StatsPage() {
  const { workouts, completions } = useApp();
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  const stats = useMemo(() => {
    const today = getTodayISO();
    
    // 1. Streak
    let streak = 0;
    let tempDate = today;
    const hasCompletionsToday = completions.some(c => c.date === tempDate && (c.count || 0) > 0);
    if (!hasCompletionsToday) {
      tempDate = addDays(tempDate, -1);
    }
    let maxLoops = 3650;
    while(maxLoops > 0) {
      const hasC = completions.some(c => c.date === tempDate && (c.count || 0) > 0);
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
          plannedCount += (w.repetitions || 1);
        }
      });
      const comps = completions.filter(c => c.date === d && (c.count || 0) > 0);
      comps.forEach(c => {
        completedCount += (c.count || 0);
      });
      d = addDays(d, 1);
      loopMax--;
    }

    const rate = plannedCount > 0 ? Math.min(Math.round((completedCount / plannedCount) * 100), 100) : 0;

    // 4. MiniChart
    const chartData = [];
    const dayLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    for (let i = 6; i >= 0; i--) {
      const cd = addDays(today, -i);
      const dw = getDayOfWeek(cd);
      const cList = completions.filter(comp => comp.date === cd && (comp.count || 0) > 0);
      let dayTotal = 0;
      cList.forEach(c => {
        dayTotal += (c.count || 0);
      });
      chartData.push({ day: dayLabels[dw], count: dayTotal });
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
          wPlanned += (w.repetitions || 1);
          const c = completions.find(c => c.workoutId === w.id && c.date === pd);
          if (c) wCompleted += (c.count || 0);
        }
        pd = addDays(pd, 1);
        subLoop--;
      }
      
      const wRate = wPlanned > 0 ? Math.min(Math.round((wCompleted / wPlanned) * 100), 100) : 0;
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
    <div className="page pb-24">
      <header className="px-4 py-4">
        <h1 className="text-xl font-bold text-slate-900">Statistiques</h1>
      </header>
      
      <div className="px-4">
        <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
          {['week', 'month', 'all'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p as any)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Tout'}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="col-span-2 bg-white rounded-3xl shadow-sm p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-4xl font-bold text-slate-900">{stats.streak}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">JOURS CONSÉCUTIFS</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-2xl font-bold text-slate-900">{stats.completedCount}/{stats.plannedCount}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">RÉPÉTITIONS</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-2xl mb-1">📈</div>
            <div className={`text-2xl font-bold ${stats.rate === 100 ? 'text-emerald-500' : 'text-slate-900'}`}>{stats.rate}%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">RÉUSSITE</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <MiniChart data={stats.chartData} />
        </div>

        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">Par programme</h3>
        <div className="flex flex-col gap-3">
          {stats.workoutsStats.length > 0 ? (
             stats.workoutsStats.map((ws: any) => {
               const theme = WORKOUT_COLORS[ws.color] || WORKOUT_COLORS.blue;
               return (
                 <div key={ws.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full ${theme.bg} flex items-center justify-center shrink-0`}></div>
                   
                   <div className="flex-1">
                     <div className="text-sm font-bold text-slate-900 mb-1">{ws.name}</div>
                     <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full rounded-full ${theme.bar}`} style={{ width: `${ws.rate}%` }}></div>
                     </div>
                   </div>
                   
                   <div className="flex flex-col items-end shrink-0">
                     <div className={`text-sm font-bold ${ws.rate === 100 ? 'text-emerald-500' : 'text-slate-900'}`}>{ws.rate}%</div>
                     <div className="text-xs text-slate-400">{ws.completed}/{ws.planned}</div>
                   </div>
                 </div>
               )
             })
          ) : (
             <div className="bg-white rounded-2xl p-6 text-center text-slate-400">
               Aucune donnée à afficher
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
