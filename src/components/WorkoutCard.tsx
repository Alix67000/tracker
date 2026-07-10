import CompletionCounter from './CompletionCounter';

const WORKOUT_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', emoji: '🏃' },
  green: { bg: 'bg-emerald-100', text: 'text-emerald-600', emoji: '🧘' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', emoji: '💪' },
  purple: { bg: 'bg-violet-100', text: 'text-violet-600', emoji: '🚴' },
  red: { bg: 'bg-rose-100', text: 'text-rose-600', emoji: '🔥' },
};

interface Props {
  workout: any;
  date: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

export default function WorkoutCard({ workout, date, count, onIncrement, onDecrement, onReset }: Props) {
  const theme = WORKOUT_COLORS[workout.color] || WORKOUT_COLORS.blue;
  const target = workout.repetitions || 1;
  const isComplete = count >= target;

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-4 mb-3 flex items-center gap-4 transition-all ${isComplete ? 'ring-2 ring-emerald-100' : ''}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${theme.bg} ${theme.text}`}>
        {theme.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={`text-base font-bold truncate ${isComplete ? 'text-emerald-600' : 'text-slate-900'}`}>
          {workout.name}
        </h3>
        {workout.repetitions && (
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Objectif : {workout.repetitions} fois
          </p>
        )}
      </div>

      <div className="shrink-0">
        <CompletionCounter 
          count={count} 
          target={target}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onReset={onReset}
        />
      </div>
    </div>
  );
}
