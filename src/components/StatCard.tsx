interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  highlight?: boolean;
}

export default function StatCard({ label, value, unit, icon, highlight }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 flex flex-col items-center text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-3xl font-bold font-['Space_Grotesk'] mb-1 ${highlight ? 'text-emerald-500' : 'text-slate-900'}`}>
        {value}
        {unit && <span className="text-sm font-medium text-slate-400 ml-1">{unit}</span>}
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}
