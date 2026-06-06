'use client';

interface ProgressBarProps {
  percent: number;
  stepLabel?: string;
}

export function ProgressBar({ percent, stepLabel }: ProgressBarProps) {
  return (
    <div className="w-full">
      {stepLabel && (
        <p className="text-xs text-gray-400 mb-1 text-right">{stepLabel}</p>
      )}
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-1.5 rounded-full bg-gray-900 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
