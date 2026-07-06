import { useApp } from '../contexts/AppContext';
import { useCompletions } from '../hooks/useCompletions';
import { getDayOfWeek, formatDateDisplay, addDays } from '../utils/date';
import WorkoutCard from '../components/WorkoutCard';

export default function TodayPage() {
  const { currentDate, setCurrentDate, workouts, loading } = useApp();
  const { toggleCompletion, getCompletionsForDate } = useCompletions();

  const handlePrevDay = () => setCurrentDate(addDays(currentDate, -1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const currentDay = getDayOfWeek(currentDate);
  const completionsToday = getCompletionsForDate(currentDate);

  const todaysWorkouts = workouts.filter(w => 
    w.daysOfWeek && w.daysOfWeek.includes(currentDay)
  );

  return (
    <div key={currentDate} className="page fade-in-transition">
      <header className="flex items-center justify-between mb-6">
        <button onClick={handlePrevDay} className="p-2 text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {formatDateDisplay(currentDate)}
          </h1>
        </div>
        <button onClick={handleNextDay} className="p-2 text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </header>

      <main>
        {loading ? (
          <div className="text-center text-slate-500 py-10">Chargement...</div>
        ) : todaysWorkouts.length > 0 ? (
          todaysWorkouts.map(workout => {
            const completion = completionsToday.find(c => c.workoutId === workout.id);
            return (
              <WorkoutCard 
                key={workout.id}
                workout={workout}
                date={currentDate}
                completion={completion}
                onToggle={() => toggleCompletion(workout.id, currentDate, !!completion?.completed)}
              />
            );
          })
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-4xl mb-3">🌿</div>
            <p className="text-slate-500 font-medium">Repos bien mérité</p>
          </div>
        )}
      </main>
    </div>
  );
}
