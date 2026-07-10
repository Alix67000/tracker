import { useApp } from '../contexts/AppContext';
import { useCompletions } from '../hooks/useCompletions';
import { getDayOfWeek, formatDateDisplay, addDays } from '../utils/date';
import WorkoutCard from '../components/WorkoutCard';

export default function TodayPage() {
  const { currentDate, setCurrentDate, workouts, loading } = useApp();
  const { incrementCompletion, decrementCompletion, resetCompletion, getCompletionCount } = useCompletions();

  const handlePrevDay = () => setCurrentDate(addDays(currentDate, -1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const currentDay = getDayOfWeek(currentDate);
  const todaysWorkouts = workouts.filter(w => w.daysOfWeek && w.daysOfWeek.includes(currentDay));

  let completedCount = 0;
  let totalCount = 0;

  todaysWorkouts.forEach(workout => {
    const count = getCompletionCount(workout.id, currentDate);
    completedCount += count;
    totalCount += workout.repetitions || 1;
  });

  const completionPercentage = totalCount > 0 ? Math.min((completedCount / totalCount) * 100, 100) : 0;

  // SVG Gauge calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div key={currentDate} className="page">
      <header className="flex items-center justify-between py-4 px-4">
        <button 
          onClick={handlePrevDay} 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-100 hover:border-slate-200 transition-all duration-200"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {formatDateDisplay(currentDate)}
          </h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {completedCount}/{totalCount} RÉPÉTITIONS
          </p>
        </div>
        
        <button 
          onClick={handleNextDay} 
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-slate-100 hover:border-slate-200 transition-all duration-200"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </header>

      <main className="flex flex-col gap-5 px-4 pb-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : todaysWorkouts.length > 0 ? (
          <>
            {/* HERO PROGRESS GAUGE */}
            <div className="flex justify-center py-4">
              <div className="relative flex items-center justify-center w-[140px] h-[140px]">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle 
                    cx="70" 
                    cy="70" 
                    r={radius} 
                    fill="none" 
                    stroke="#f1f5f9"
                    strokeWidth="10" 
                  />
                  <circle 
                    cx="70" 
                    cy="70" 
                    r={radius} 
                    fill="none" 
                    stroke="currentColor"
                    className="text-blue-500 transition-all duration-500 ease-in-out"
                    strokeWidth="10" 
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900 leading-none">
                    {completedCount}/{totalCount}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Complétées
                  </span>
                </div>
              </div>
            </div>

            {/* LIST OF WORKOUTS */}
            <div className="flex flex-col gap-3">
              {todaysWorkouts.map(workout => {
                const count = getCompletionCount(workout.id, currentDate);
                return (
                  <WorkoutCard 
                    key={workout.id}
                    workout={workout}
                    date={currentDate}
                    count={count}
                    onIncrement={() => incrementCompletion(workout.id, currentDate)}
                    onDecrement={() => decrementCompletion(workout.id, currentDate)}
                    onReset={() => resetCompletion(workout.id, currentDate)}
                  />
                );
              })}
            </div>
          </>
        ) : (
          /* EMPTY STATE */
          <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">🌿</div>
            <h3 className="text-lg font-bold text-slate-900">Repos bien mérité</h3>
            <p className="text-sm text-slate-500 mt-1">Aucune séance programmée aujourd'hui</p>
          </div>
        )}
      </main>
    </div>
  );
}
