import { useState, FormEvent } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import { Pencil, Trash2 } from 'lucide-react';

const COLORS = [
  { id: 'blue', dot: 'bg-blue-500', text: 'text-blue-500', label: 'Cardio' },
  { id: 'green', dot: 'bg-emerald-500', text: 'text-emerald-500', label: 'Zen' },
  { id: 'orange', dot: 'bg-orange-500', text: 'text-orange-500', label: 'Force' },
  { id: 'purple', dot: 'bg-violet-500', text: 'text-violet-500', label: 'Récup' },
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
  const [repetitions, setRepetitions] = useState('');
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
    setRepetitions('');
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
      repetitions: repetitions ? parseInt(repetitions, 10) : undefined,
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
    setRepetitions(workout.repetitions ? workout.repetitions.toString() : '');
    setSelectedDays(workout.daysOfWeek || []);
    setColor(workout.color || COLORS[0].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce programme ?")) {
      await deleteWorkout(id);
      showToast('Supprimé ✓');
      if (editId === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="page pb-20 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          {toast}
        </div>
      )}

      <header className="px-4 py-4">
        <h1 className="text-xl font-bold text-slate-900">Programmes</h1>
        <p className="text-sm text-slate-500">Gérez vos séances</p>
      </header>

      <div className="px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-5 mb-6">
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Nom du programme
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Course, Yoga..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Répétitions
            </label>
            <div className="relative">
              <input
                type="number"
                value={repetitions}
                onChange={(e) => setRepetitions(e.target.value)}
                placeholder="Ex: 10"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                fois
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Jours
            </label>
            <div className="flex gap-2 justify-between">
              {DAYS.map(day => {
                const isActive = selectedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => handleToggleDay(day.id)}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' 
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Couleur
            </label>
            <div className="grid grid-cols-4 gap-3">
              {COLORS.map(c => {
                const isActive = color === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColor(c.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                      isActive 
                        ? `border-current bg-slate-50 ${c.text}` 
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full ${c.dot}`}></div>
                    <span className={`text-xs font-semibold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full bg-blue-500 text-white rounded-xl py-3 font-bold text-base transition-colors ${
                !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {editId ? 'Modifier' : 'Ajouter'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </form>

        <h2 className="text-lg font-bold text-slate-900 mb-3">
          Vos programmes
        </h2>
        
        {workouts.length > 0 ? (
          <div className="flex flex-col gap-3">
            {workouts.map(workout => {
              const theme = COLORS.find(c => c.id === workout.color) || COLORS[0];
              
              return (
                <div key={workout.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                  <div className={`w-1 self-stretch rounded-full ${theme.dot}`}></div>
                  
                  <div className="w-12 text-center shrink-0">
                    {workout.repetitions ? (
                      <>
                        <div className="text-xl font-bold text-slate-900">{workout.repetitions}</div>
                        <div className="text-xs text-slate-400 uppercase font-semibold">fois</div>
                      </>
                    ) : (
                      <div className="text-slate-400 text-xl font-bold">-</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-900">{workout.name}</div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {DAYS.map(day => {
                        const isActive = workout.daysOfWeek?.includes(day.id);
                        return (
                          <div 
                            key={day.id}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                              isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {day.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => handleEdit(workout)}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                    >
                      <Pencil size={16} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleDelete(workout.id)}
                      className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 font-medium">
            Aucun programme pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
