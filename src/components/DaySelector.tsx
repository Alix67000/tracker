interface Props {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
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

export default function DaySelector({ selectedDays, onToggleDay }: Props) {
  return (
    <div className="flex gap-2">
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.id);
        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onToggleDay(day.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
              ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}
            `}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
}
