'use client';

interface OptionCardProps {
  icon?: string;
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function OptionCard({ icon, label, description, selected = false, onClick, disabled = false }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        option-card w-full text-left p-4 rounded-xl border-2 transition-all duration-150
        ${selected
          ? 'border-gray-900 bg-gray-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50/30'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-1
      `}
      aria-pressed={selected}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className="text-2xl flex-shrink-0" aria-hidden="true">{icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-snug ${selected ? 'text-gray-900' : 'text-gray-800'}`}>
            {label}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>
          )}
        </div>
        {selected && (
          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
    </button>
  );
}
