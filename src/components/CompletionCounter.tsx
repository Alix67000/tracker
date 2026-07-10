import { useEffect, useState } from 'react';

interface Props {
  count: number;
  target: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

export default function CompletionCounter({ count, target, onIncrement, onDecrement, onReset }: Props) {
  const [showCelebration, setShowCelebration] = useState(false);
  const isComplete = count >= target && target > 0;

  useEffect(() => {
    if (isComplete) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, count]);

  return (
    <div className="flex items-center gap-1.5 relative shrink-0">
      {showCelebration && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-1 rounded-full whitespace-nowrap animate-bounce shadow-lg z-20">
          🎉 Objectif atteint!
        </div>
      )}

      {count > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          className="w-6 h-6 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center hover:text-rose-500 hover:bg-rose-50 transition-colors shrink-0"
          title="Reset"
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onDecrement(); }}
        disabled={count === 0}
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all shrink-0 ${
          count === 0 ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-slate-300 text-slate-600 bg-white hover:bg-slate-50 active:scale-95'
        }`}
        type="button"
      >
        −
      </button>

      <div className={`w-7 text-center font-bold text-lg select-none transition-colors shrink-0 ${
        isComplete ? 'text-emerald-500' : count > 0 ? 'text-slate-900' : 'text-slate-400'
      }`}>
        {count}
        {isComplete && (
          <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-500 mt-0.5">
            MAX
          </span>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onIncrement(); }}
        disabled={isComplete}
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-base transition-all shadow-sm shrink-0 ${
          isComplete ? 'bg-emerald-500 text-white cursor-default' : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
        }`}
        type="button"
      >
        {isComplete ? '✓' : '+'}
      </button>
    </div>
  );
}
