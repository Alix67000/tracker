import CompletionCheckbox from './CompletionCheckbox';
import { getDayOfWeek } from '../utils/date';
import { Key } from 'react';

interface Props {
  key?: Key;
  workout: any;
  date: string;
  completion: any;
  onToggle: () => void;
}

const DAYS = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'M' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 0, label: 'D' },
];

export default function WorkoutCard({ workout, date, completion, onToggle }: Props) {
  const isCompleted = completion?.completed;
  const currentDay = getDayOfWeek(date);

  return (
    <div 
      className={`card flex items-center p-4 transition-all duration-300 ${isCompleted ? 'opacity-60 grayscale-[50%]' : ''}`}
    >
      <div className="flex-1">
        <h3 className={`font-bold text-slate-800 text-lg ${isCompleted ? 'line-through text-slate-500' : ''}`}>
          {workout.name}
        </h3>
        {workout.duration && (
          <p className="text-slate-500 text-sm mb-2">{workout.duration} min</p>
        )}
        
        <div className="flex gap-1">
          {DAYS.map((day) => {
            const isActiveDay = day.id === currentDay;
            const isWorkoutDay = workout.daysOfWeek?.includes(day.id);
            return (
              <div 
                key={day.id}
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${isActiveDay && isWorkoutDay ? 'bg-blue-600 text-white' : 
                    isWorkoutDay ? 'bg-slate-200 text-slate-600' : 'bg-slate-50 text-slate-300'
                  }
                `}
              >
                {day.label}
              </div>
            );
          })}
        </div>
      </div>

      <div className="ml-4">
        <CompletionCheckbox checked={!!isCompleted} onChange={onToggle} />
      </div>
    </div>
  );
}
