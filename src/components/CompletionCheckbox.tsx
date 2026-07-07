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
      className="flex items-center justify-center cursor-pointer select-none"
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: checked ? 'var(--accent-blue)' : 'transparent',
        border: `2px solid ${checked ? 'var(--accent-blue)' : 'var(--border)'}`,
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => { if (!checked) e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
      onMouseOut={(e) => { if (!checked) e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {checked && (
        <svg className="w-5 h-5 check-animate" fill="none" stroke="white" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}
