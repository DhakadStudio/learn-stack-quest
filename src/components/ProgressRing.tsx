import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPercentage?: boolean;
  strokeWidth?: number;
}

export const ProgressRing = ({ 
  progress, 
  size = 'md', 
  className,
  showPercentage = true,
  strokeWidth = 8
}: ProgressRingProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const radius = size === 'sm' ? 20 : size === 'md' ? 28 : 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-primary transition-all duration-500 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      
      {showPercentage && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center font-semibold text-foreground',
          textSizes[size]
        )}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};