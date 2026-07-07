import { KeyboardEvent } from 'react';

interface Props {
  checked: boolean;
  onChange: () => void;
}

export default function CompletionCheckbox({ checked, onChange }: Props) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange();
    }
  };

  return (
    <button
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={handleKeyDown}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
        checked 
          ? 'bg-blue-500 border-transparent shadow-md shadow-blue-500/30' 
          : 'border-2 border-slate-200 bg-white hover:border-blue-400'
      }`}
    >
      {checked && (
        <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}
