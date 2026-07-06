interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
}

export default function StatCard({ label, value, unit, icon }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm fade-in-transition">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-extrabold text-slate-800">
        {value}
        {unit && <span className="text-sm font-medium text-slate-500 ml-1">{unit}</span>}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}
