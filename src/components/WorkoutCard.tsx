import CompletionCheckbox from './CompletionCheckbox';
import { getDayOfWeek } from '../utils/date';

const WORKOUT_COLORS: Record<string, { color: string; emoji: string }> = {
  blue: { color: 'var(--accent-blue)', emoji: '🏃' },
  red: { color: 'var(--accent-red)', emoji: '◆' },
  green: { color: 'var(--accent-green)', emoji: '○' },
  amber: { color: 'var(--accent-amber)', emoji: '◇' },
  orange: { color: 'var(--accent-amber)', emoji: '◇' },
  purple: { color: 'var(--accent-purple)', emoji: '🧘' },
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

export default function WorkoutCard({ workout, date, completion, onToggle }: { workout: any; date: string; completion: any; onToggle: () => void }) {
  const isCompleted = completion?.completed;
  const currentDay = getDayOfWeek(date);
  const theme = WORKOUT_COLORS[workout.color] || WORKOUT_COLORS.blue;

  return (
    <div 
      className="surface flex items-center p-4 transition-opacity duration-250 ease-in-out"
      style={{ 
        opacity: isCompleted ? 0.55 : 1,
        padding: '1rem',
      }}
    >
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ 
          backgroundColor: `color-mix(in srgb, ${theme.color} 10%, transparent)`, 
          color: theme.color,
          fontSize: '1.25rem'
        }}
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

      <div className="shrink-0">
        <CompletionCheckbox checked={!!isCompleted} onChange={onToggle} />
      </div>
    </div>
  );
}
