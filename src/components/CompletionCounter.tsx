export default function CompletionCounter({
  count,
  onIncrement,
  onDecrement,
  onReset
}: {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {count > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          className="w-6 h-6 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Reset"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onDecrement(); }}
        disabled={count === 0}
        className={`w-8 h-8 rounded-full border border-slate-200 text-slate-600 flex items-center justify-center font-bold transition-all ${
          count === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-slate-50 hover:bg-slate-100'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>

      <div className={`w-8 text-center font-sans font-bold text-xl ${count === 0 ? 'text-slate-400' : 'text-slate-900'}`}>
        {count}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onIncrement(); }}
        className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center hover:brightness-110 transition-all shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
