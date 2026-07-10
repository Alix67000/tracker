import { useState, useEffect } from 'react';

interface Props {
  onSuccess: () => void;
}

export default function PinScreen({ onSuccess }: Props) {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === '0935') {
        localStorage.setItem('tracker_authenticated', 'true');
        onSuccess();
      } else {
        setIsError(true);
        const timer = setTimeout(() => {
          setPin('');
          setIsError(false);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [pin, onSuccess]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4 && !isError) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0 && !isError) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-slate-50 px-6 py-12 select-none">
      <div className="flex flex-col items-center mt-8">
        <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center text-white text-3xl shadow-md mb-4 animate-pulse">
          🔒
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Tracker</h1>
        <p className="text-sm text-slate-400 mt-1">Saisissez votre code PIN pour accéder à l'application</p>
      </div>

      <div className="flex flex-col items-center my-6">
        <div className={`flex gap-4 mb-4 ${isError ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                isError 
                  ? 'bg-rose-500 border-rose-500 animate-bounce' 
                  : index < pin.length 
                    ? 'bg-blue-500 border-blue-500 scale-110' 
                    : 'border-slate-300 bg-transparent'
              }`}
            />
          ))}
        </div>
        <div className="h-6">
          {isError && <span className="text-sm font-semibold text-rose-500">Code PIN incorrect</span>}
        </div>
      </div>

      <div className="w-full max-w-[280px] grid grid-cols-3 gap-y-4 gap-x-6 justify-items-center mb-6">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xl font-bold text-slate-700 active:bg-slate-100 active:scale-95 transition-all shadow-sm cursor-pointer"
            type="button"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => setPin('')}
          className="w-16 h-16 flex items-center justify-center text-xs font-semibold text-slate-400 active:text-slate-600 transition-colors cursor-pointer"
          type="button"
          disabled={pin.length === 0}
        >
          Effacer
        </button>
        <button
          onClick={() => handleKeyPress('0')}
          className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center text-xl font-bold text-slate-700 active:bg-slate-100 active:scale-95 transition-all shadow-sm cursor-pointer"
          type="button"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="w-16 h-16 flex items-center justify-center text-slate-400 active:text-slate-600 active:scale-95 transition-all cursor-pointer"
          type="button"
          disabled={pin.length === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
