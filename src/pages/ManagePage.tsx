import { useState, FormEvent } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import DaySelector from '../components/DaySelector';

const COLORS = [
  { id: 'blue', class: 'bg-blue-500' },
  { id: 'green', class: 'bg-emerald-500' },
  { id: 'orange', class: 'bg-orange-500' },
  { id: 'purple', class: 'bg-purple-500' },
];

const DAYS = [
  { id: 1, label: 'L' },
  { id: 2, label: 'M' },
  { id: 3, label: 'M' },
  { id: 4, label: 'J' },
  { id: 5, label: 'V' },
  { id: 6, label: 'S' },
  { id: 0, label: 'D' },
];

export default function ManagePage() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useWorkouts();
  
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [color, setColor] = useState(COLORS[0].id);
  const [toast, setToast] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && selectedDays.length > 0;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setDuration('');
    setSelectedDays([]);
    setColor(COLORS[0].id);
  };

  const handleToggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const data = {
      name: name.trim(),
      duration: duration ? parseInt(duration, 10) : undefined,
      daysOfWeek: selectedDays,
      color
    };

    if (editId) {
      await updateWorkout(editId, data);
      showToast('Modifié ✓');
    } else {
      await addWorkout(data);
      showToast('Enregistré ✓');
    }
    resetForm();
  };

  const handleEdit = (workout: any) => {
    setEditId(workout.id);
    setName(workout.name);
    setDuration(workout.duration ? workout.duration.toString() : '');
    setSelectedDays(workout.daysOfWeek || []);
    setColor(workout.color || COLORS[0].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet entraînement ?")) {
      await deleteWorkout(id);
      showToast('Supprimé ✓');
      if (editId === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="page pb-8 relative">
      {toast && <div className="toast">{toast}</div>}
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Entraînements
        </h1>
        <p className="text-slate-400 text-sm">Gérez vos habitudes quotidiennes</p>
      </header>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-700 mb-4">
          {editId ? 'Modifier' : 'Nouvel entraînement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Course, Yoga..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Durée (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ex: 30"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Jours
            </label>
            <DaySelector selectedDays={selectedDays} onToggleDay={handleToggleDay} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Couleur
            </label>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-8 h-8 rounded-full ${c.class} transition-transform ${color === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-50'}`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={!isValid}
              className={`flex-1 btn ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {editId ? 'Modifier' : 'Enregistrer'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
          Vos Entraînements ({workouts.length})
        </h2>
        <div className="space-y-3">
          {workouts.map(workout => (
            <div key={workout.id} className="flex items-center p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
              <div className="flex-1">
                <p className="font-bold text-slate-700 text-sm">{workout.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {workout.duration && (
                    <span className="text-slate-400 text-xs">{workout.duration} min</span>
                  )}
                  <div className="flex gap-1">
                    {DAYS.map(day => (
                      <div 
                        key={day.id}
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold
                          ${workout.daysOfWeek?.includes(day.id) ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-300'}
                        `}
                      >
                        {day.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => handleEdit(workout)}
                  className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button 
                  onClick={() => handleDelete(workout.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {workouts.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-4">Aucun entraînement pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
