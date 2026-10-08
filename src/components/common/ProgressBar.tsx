import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100+
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  color = 'bg-stone-900',
  showLabel = false,
  className = '',
}) => {
  const cappedProgress = Math.min(100, Math.max(0, progress));

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-stone-200/80 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${cappedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-stone-500 mt-1 tabular-nums">
          <span>{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
};
