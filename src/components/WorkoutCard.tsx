import CompletionCounter from './CompletionCounter';
import { getDayOfWeek } from '../utils/date';

const WORKOUT_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', emoji: '🏃' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600', emoji: '🧘' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', emoji: '💪' },
  purple: { bg: 'bg-violet-100', text: 'text-violet-600', emoji: '🚴' },
  red: { bg: 'bg-rose-100', text: 'text-rose-600', emoji: '🔥' },
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

export default function WorkoutCard({ workout, date, count, onIncrement, onDecrement, onReset }: { 
  key?: any; 
  workout: any; 
  date: string; 
  count: number; 
  onIncrement: () => void; 
  onDecrement: () => void;
  onReset: () => void;
}) {
  const isStarted = count > 0;
  const isCompleted = workout.repetitions && count >= workout.repetitions;
  const currentDay = getDayOfWeek(date);
  const theme = WORKOUT_COLORS[workout.color] || WORKOUT_COLORS.blue;

  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border ${isCompleted ? 'border-emerald-200' : isStarted ? 'border-blue-200' : 'border-slate-100'} flex items-center p-4 transition-all duration-200`}
    >
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${theme.bg} ${theme.text} text-xl transition-all duration-200`}
      >
        {theme.emoji}
      </div>

      <div className="flex-1 ml-4 mr-4">
        <h3 
          className={`text-base font-semibold mb-1 ${isCompleted ? 'text-emerald-700' : 'text-slate-900'} transition-colors duration-200`}
        >
          {workout.name}
        </h3>
        {workout.repetitions && (
          <p className="text-sm mb-3 text-slate-500">
            Objectif : {workout.repetitions} fois
          </p>
        )}
        <div className="flex gap-1.5 mt-2">
          {DAYS.map(day => {
            const isWorkoutDay = workout.daysOfWeek?.includes(day.id);
            const isActiveDay = day.id === currentDay;
            
            const baseClass = "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all duration-200";
            const activeClass = isActiveDay && isWorkoutDay ? `bg-blue-500 text-white` : 'bg-slate-100 text-slate-400';
            const inactiveClass = !isWorkoutDay ? 'opacity-30' : '';
            
            return (
              <div key={day.id} className={`${baseClass} ${activeClass} ${inactiveClass}`}>
                {day.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0">
        <CompletionCounter 
          count={count} 
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onReset={onReset}
        />
      </div>
    </div>
  );
}
