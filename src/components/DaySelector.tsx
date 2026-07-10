interface Props {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
}

const DAYS = [
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mer' },
  { id: 4, label: 'Jeu' },
  { id: 5, label: 'Ven' },
  { id: 6, label: 'Sam' },
  { id: 0, label: 'Dim' },
];

export default function DaySelector({ selectedDays, onToggleDay }: Props) {
  return (
    <div className="flex gap-1 bg-slate-100 rounded-xl p-1 border border-slate-100">
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.id);
        return (
          <button
            key={day.id}
            type="button"
            onClick={() => onToggleDay(day.id)}
            className={`flex-1 py-1 text-sm transition-colors ${
              isSelected 
                ? 'bg-white text-blue-500 font-bold shadow-sm rounded-lg' 
                : 'text-slate-400 hover:text-slate-600 bg-transparent rounded-lg font-medium'
            }`}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
}
