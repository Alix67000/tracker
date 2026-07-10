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
  const todaysWorkouts = workouts.filter((w: any) => w.daysOfWeek && w.daysOfWeek.includes(currentDay));

  let completedCount = 0;
  let totalCount = 0;

  todaysWorkouts.forEach((workout: any) => {
    const count = getCompletionCount(workout.id, currentDate);
    completedCount += count;
    totalCount += workout.repetitions || 1;
  });

  const completionPercentage = totalCount > 0 ? Math.min((completedCount / totalCount) * 100, 100) : 0;

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div key={currentDate} className="page">
      <header className="flex items-center justify-between px-4 py-4">
        <button
          onClick={handlePrevDay}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Jour précédent"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="text-center">
          <div className="text-xl font-bold text-slate-900">{formatDateDisplay(currentDate)}</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
            {todaysWorkouts.length > 0 ? `${completedCount}/${totalCount} répétitions` : 'Aucune séance prévue'}
          </div>
        </div>

        <button
          onClick={handleNextDay}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Jour suivant"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </header>

      {todaysWorkouts.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm p-6 flex justify-center items-center mb-4 mx-4">
          <div className="relative w-[140px] h-[140px]">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C6FF" />
                  <stop offset="100%" stopColor="#0078FF" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r="58" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="70" cy="70" r="58"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 70 70)"
                className="transition-all duration-[600ms] ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">
                {completedCount}<span className="text-base text-slate-400">/{totalCount}</span>
              </span>
              <span className="text-xs font-medium text-slate-500 mt-1">
                Complétées
              </span>
            </div>
          </div>
        </div>
      )}

      <main>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : todaysWorkouts.length > 0 ? (
          <div className="px-4">
            {todaysWorkouts.map((workout: any) => {
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
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center mx-4">
            <div className="text-4xl mb-3">🌿</div>
            <p className="text-slate-500 font-medium">Repos bien mérité</p>
            <p className="text-slate-400 text-sm mt-1">Aucune séance programmée aujourd'hui</p>
          </div>
        )}
      </main>
    </div>
  );
}
