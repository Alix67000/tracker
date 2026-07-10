import { useState, FormEvent } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import DaySelector from '../components/DaySelector';

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; bar: string; light: string }> = {
  blue:  { border: 'border-blue-400',  bg: 'bg-blue-100',  text: 'text-blue-600',  bar: 'bg-blue-500',  light: 'bg-blue-50' },
  red:   { border: 'border-red-400',   bg: 'bg-red-100',   text: 'text-red-600',   bar: 'bg-red-500',   light: 'bg-red-50' },
  green: { border: 'border-emerald-400', bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500', light: 'bg-emerald-50' },
  amber: { border: 'border-amber-400', bg: 'bg-amber-100', text: 'text-amber-600', bar: 'bg-amber-500', light: 'bg-amber-50' },
};

const ACTIVITY_TYPES = [
  { id: 'blue',   label: 'Endurance', icon: '⟫' },
  { id: 'red',    label: 'Force',     icon: '◆' },
  { id: 'green',  label: 'Mobilité',  icon: '○' },
  { id: 'amber',  label: 'Technique', icon: '◇' },
] as const;

type ColorId = typeof ACTIVITY_TYPES[number]['id'];

const DAYS = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'M' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 0, label: 'D' },
] as const;

function getActivityType(id: string | undefined) {
  return ACTIVITY_TYPES.find(t => t.id === id) || ACTIVITY_TYPES[0];
}

function frequencyLabel(days: number[] | undefined) {
  if (!days || days.length === 0) return 'Aucun';
  if (days.length === 7) return 'Quotidien';
  return `${days.length}× par semaine`;
}

export default function ManagePage() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useWorkouts();

  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [color, setColor] = useState<ColorId>(ACTIVITY_TYPES[0].id);
  const [toast, setToast] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && selectedDays.length > 0;
  const activeType = getActivityType(color);
  const activeColorMap = COLOR_MAP[activeType.id] || COLOR_MAP['blue'];

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setRepetitions('');
    setSelectedDays([]);
    setColor(ACTIVITY_TYPES[0].id);
  };

  const handleToggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const data = {
      name: name.trim(),
      repetitions: repetitions ? parseInt(repetitions, 10) : undefined,
      daysOfWeek: selectedDays,
      color,
    };

    if (editId) {
      await updateWorkout(editId, data);
      showToast('Programme mis à jour');
    } else {
      await addWorkout(data);
      showToast('Programme créé');
    }
    resetForm();
  };

  const handleEdit = (workout: any) => {
    setEditId(workout.id);
    setName(workout.name);
    setRepetitions(workout.repetitions ? workout.repetitions.toString() : '');
    setSelectedDays(workout.daysOfWeek || []);
    setColor((workout.color as ColorId) || ACTIVITY_TYPES[0].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer ce programme ?')) {
      await deleteWorkout(id);
      showToast('Programme supprimé');
      if (editId === id) resetForm();
    }
  };

  return (
    <div className="pb-8 relative">
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}

      <header className="mb-4">
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900">
          Programmes
        </h1>
        <p className="text-sm mt-1 text-slate-500">
          Construisez vos séances hebdomadaires
        </p>
      </header>

      <div className={`bg-white rounded-2xl shadow-sm p-5 border border-slate-100 border-l-4 ${activeColorMap.border} mb-6`}>
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-['Space_Grotesk'] font-bold ${activeColorMap.light} ${activeColorMap.text}`}>
            {activeType.icon}
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
              {editId ? 'Modifier le programme' : 'Nouveau programme'}
            </h2>
            <p className="text-xs text-slate-400">
              {editId ? 'Ajustez les paramètres' : 'Définissez une séance régulière'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Nom du programme</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Course lente, HIIT, Yoga..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Répétitions</label>
            <div className="relative">
              <input
                type="number"
                value={repetitions}
                onChange={e => setRepetitions(e.target.value)}
                placeholder="10"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                fois
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Jours de la semaine</label>
            <DaySelector selectedDays={selectedDays} onToggleDay={handleToggleDay} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Type d'activité</label>
            <div className="grid grid-cols-4 gap-3">
              {ACTIVITY_TYPES.map(type => {
                const isActive = color === type.id;
                const map = COLOR_MAP[type.id] || COLOR_MAP['blue'];
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setColor(type.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border bg-white cursor-pointer transition-all ${
                      isActive ? `ring-2 ring-blue-500 border-blue-500` : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full ${map.bar}`} />
                    <span className={`text-xs font-semibold ${isActive ? map.text : 'text-slate-500'}`}>
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button type="submit" disabled={!isValid} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              <span>{editId ? 'Mettre à jour' : 'Créer le programme'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-['Space_Grotesk'] text-lg font-bold text-slate-900">
            Vos programmes
          </h2>
          <span className="text-xs font-bold px-2 py-1 rounded-md bg-white border border-slate-100 text-slate-500 shadow-sm">
            {workouts.length}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {workouts.map(workout => {
            const type = getActivityType(workout.color);
            const map = COLOR_MAP[type.id] || COLOR_MAP['blue'];
            const days = workout.daysOfWeek || [];
            return (
              <div key={workout.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex items-stretch">
                <div className={`w-1 shrink-0 ${map.bar}`} />

                <div className="flex-1 p-4 flex gap-4 items-center">
                  <div className="flex flex-col items-center justify-center w-12 shrink-0">
                    <span className="text-2xl font-bold text-slate-900 leading-none">
                      {workout.repetitions || '—'}
                    </span>
                    {workout.repetitions && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">fois</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{workout.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {DAYS.map(day => {
                        const isActive = days.includes(day.id);
                        return (
                          <span
                            key={day.id}
                            className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                              isActive ? 'bg-blue-100 text-blue-500' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {day.label}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {frequencyLabel(days)} · {type.label}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                      aria-label="Modifier"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      aria-label="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {workouts.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center py-10">
              <div className="text-3xl mb-2">🌿</div>
              <p className="text-sm font-medium text-slate-500">
                Aucun programme actif
              </p>
              <p className="text-xs mt-1 text-slate-400">
                Créez votre première séance ci-dessus
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
