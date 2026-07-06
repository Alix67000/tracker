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
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={handleKeyDown}
      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out select-none
        ${checked 
          ? 'bg-emerald-500 border-emerald-500 text-white check-animate' 
          : 'bg-white border-slate-300 text-transparent hover:border-slate-400'
        }
      `}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}
