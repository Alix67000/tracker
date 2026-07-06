import { useApp } from '../contexts/AppContext';
import { useCompletions } from '../hooks/useCompletions';
import { getDayOfWeek, formatDateDisplay, addDays } from '../utils/date';

const WORKOUT_COLORS: Record<string, { color: string; emoji: string }> = {
  blue: { color: 'var(--accent-blue)', emoji: '🏃' },
  red: { color: 'var(--accent-red)', emoji: '◆' },
  green: { color: 'var(--accent-green)', emoji: '○' },
  amber: { color: 'var(--accent-amber)', emoji: '◇' },
  orange: { color: 'var(--accent-amber)', emoji: '◇' }, // Fallback for existing data
  purple: { color: 'var(--accent-purple)', emoji: '🧘' }, // Fallback for existing data
};

const DAYS = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'M' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 0, label: 'D' },
];

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
    <div key={currentDate} className="page pb-24" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <header className="flex items-center justify-between mb-8 px-2 pt-4">
        <button 
          onClick={handlePrevDay} 
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors border border-transparent"
          style={{ backgroundColor: 'var(--surface)' }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
        >
          <svg className="w-6 h-6" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h1 
          className="text-2xl font-bold m-0" 
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
        >
          {formatDateDisplay(currentDate)}
        </h1>
        
        <button 
          onClick={handleNextDay} 
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors border border-transparent"
          style={{ backgroundColor: 'var(--surface)' }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
        >
          <svg className="w-6 h-6" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </header>

      <main className="px-2">
        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="spinner"></div>
          </div>
        ) : todaysWorkouts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {todaysWorkouts.map((workout, index) => {
              const completion = completionsToday.find(c => c.workoutId === workout.id);
              const isCompleted = !!completion?.completed;
              const theme = WORKOUT_COLORS[workout.color] || WORKOUT_COLORS.blue;

              return (
                <div 
                  key={workout.id}
                  className="surface flex items-center p-4 transition-opacity duration-250 ease-in-out"
                  style={{ 
                    animation: `fadeIn 0.3s ease-out forwards`,
                    animationDelay: `${index * 0.05}s`,
                    opacity: isCompleted ? 0.55 : 1,
                    padding: '1rem',
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: `color-mix(in srgb, ${theme.color} 10%, transparent)`, color: theme.color }}
                  >
                    {theme.emoji}
                  </div>

                  <div className="flex-1 ml-4 mr-4">
                    <h3 
                      className={`text-base font-semibold mb-1 ${isCompleted ? 'line-through' : ''}`}
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
                    >
                      {workout.name}
                    </h3>
                    {workout.duration && (
                      <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                        {workout.duration} min
                      </p>
                    )}
                    <div className="flex gap-1.5 mt-2">
                      {DAYS.map(day => {
                        const isWorkoutDay = workout.daysOfWeek?.includes(day.id);
                        const isActiveDay = day.id === currentDay;
                        
                        let tagClass = "program-schedule-tag flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold";
                        if (isActiveDay && isWorkoutDay) {
                          tagClass += " active";
                        }
                        
                        let inlineStyle: any = { margin: 0, padding: 0 };
                        if (!isWorkoutDay) {
                          inlineStyle.color = 'var(--text-muted)';
                          inlineStyle.opacity = 0.3;
                          inlineStyle.backgroundColor = 'transparent';
                        }
                        
                        return (
                          <div key={day.id} className={tagClass} style={inlineStyle}>
                            {day.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCompletion(workout.id, currentDate, isCompleted)}
                    className="w-[36px] h-[36px] rounded-full shrink-0 flex items-center justify-center transition-colors border-2 focus:outline-none"
                    style={{
                      backgroundColor: isCompleted ? 'var(--accent-blue)' : 'transparent',
                      borderColor: isCompleted ? 'var(--accent-blue)' : 'var(--border)'
                    }}
                    onMouseOver={(e) => { if (!isCompleted) e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
                    onMouseOut={(e) => { if (!isCompleted) e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {isCompleted && (
                      <svg className="w-5 h-5 text-white check-animate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="surface flex flex-col items-center justify-center py-10 text-center mx-auto mt-4">
            <div className="text-3xl mb-4">🌿</div>
            <h3 
              className="text-sm mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}
            >
              Aucune séance prévue
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Ajoutez un programme dans l'onglet Entraînements
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
