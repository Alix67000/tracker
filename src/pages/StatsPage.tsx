import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { getTodayISO, getDayOfWeek, getWeekStart, addDays } from '../utils/date';

const WORKOUT_COLORS: Record<string, { color: string; emoji: string }> = {
  blue: { color: 'var(--accent-blue)', emoji: '🏃' },
  red: { color: 'var(--accent-red)', emoji: '◆' },
  green: { color: 'var(--accent-green)', emoji: '○' },
  amber: { color: 'var(--accent-amber)', emoji: '◇' },
  orange: { color: 'var(--accent-amber)', emoji: '◇' }, // Fallback for existing data
  purple: { color: 'var(--accent-purple)', emoji: '🧘' }, // Fallback for existing data
};

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

  const maxCount = Math.max(...stats.chartData.map(d => d.count), 1);
  const barWidth = 28;
  const gap = (300 - 7 * barWidth) / 6;

  return (
    <div className="page pb-24" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <header className="mb-6 pt-4">
        <h1 className="text-2xl font-bold m-0" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
          Statistiques
        </h1>
      </header>
      
      <div className="surface flex gap-1 p-1 rounded-[14px] mb-6">
        {['week', 'month', 'all'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p as any)}
            className="flex-1 rounded-[12px] py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              fontFamily: 'var(--font-display)',
              backgroundColor: period === p ? 'var(--surface-raised)' : 'transparent',
              color: period === p ? 'var(--text)' : 'var(--text-muted)',
              boxShadow: period === p ? '0 1px 4px rgba(0,0,0,0.4)' : 'none'
            }}
          >
            {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Tout'}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="surface col-span-2 flex flex-col items-center justify-center pt-6 pb-6">
          <div className="text-2xl mb-2">🔥</div>
          <div className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            {stats.streak}
          </div>
          <div className="label-dark">jours consécutifs</div>
        </div>
        
        <div className="surface flex flex-col items-center justify-center pt-6 pb-6">
          <div className="text-xl mb-2">🎯</div>
          <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            {stats.completedCount} / {stats.plannedCount}
          </div>
          <div className="label-dark">SÉANCES</div>
        </div>
        
        <div className="surface flex flex-col items-center justify-center pt-6 pb-6">
          <div className="text-xl mb-2">📈</div>
          <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: stats.rate === 100 ? 'var(--accent-green)' : 'var(--text)' }}>
            {stats.rate}%
          </div>
          <div className="label-dark">RÉUSSITE</div>
        </div>
      </div>

      <div className="surface mb-6">
        <div className="label-dark mb-4">7 derniers jours</div>
        <svg width="100%" height="120px" viewBox="0 0 300 120">
          {stats.chartData.map((d, i) => {
            const x = i * (barWidth + gap);
            const h = (d.count / maxCount) * 90;
            const y = 90 - h;
            const isToday = i === 6;
            return (
              <g key={i}>
                <rect x={x} y={0} width={barWidth} height={90} rx={6} fill="var(--surface-raised)" />
                {d.count > 0 && (
                  <rect 
                    x={x} y={y} width={barWidth} height={h} rx={6} fill="var(--accent-blue)"
                    style={{ opacity: isToday ? 1 : 0.7, transition: 'all 0.5s ease' }}
                  />
                )}
                <text 
                  x={x + barWidth / 2} 
                  y={110} 
                  textAnchor="middle" 
                  style={{ fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600, fill: 'var(--text-muted)' }}
                >
                  {d.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div>
        <h3 className="text-lg font-bold mt-6 mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
          Par programme
        </h3>
        <div className="flex flex-col gap-3">
          {stats.workoutsStats.length > 0 ? (
             stats.workoutsStats.map((ws: any) => {
               const theme = WORKOUT_COLORS[ws.color] || WORKOUT_COLORS.blue;
               return (
                 <div key={ws.id} className="surface flex items-center p-5">
                   <div 
                     className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                     style={{ backgroundColor: `color-mix(in srgb, ${theme.color} 10%, transparent)`, color: theme.color }}
                   >
                     {theme.emoji}
                   </div>
                   
                   <div className="flex-1 ml-3 mr-4">
                     <div className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                       {ws.name}
                     </div>
                     <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'var(--surface-raised)' }}>
                       <div 
                         className="h-1.5 rounded-full transition-all duration-500" 
                         style={{ backgroundColor: theme.color, width: `${ws.rate}%` }}
                       ></div>
                     </div>
                   </div>
                   
                   <div className="flex flex-col items-end shrink-0">
                     <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: ws.rate === 100 ? 'var(--accent-green)' : theme.color }}>
                       {ws.rate}%
                     </div>
                     <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                       {ws.completed}/{ws.planned}
                     </div>
                   </div>
                 </div>
               )
             })
          ) : (
             <div className="surface text-center py-6">
               <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Aucune donnée à afficher</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

