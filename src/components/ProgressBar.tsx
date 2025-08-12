import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

export const ProgressBar = ({ 
  progress, 
  className,
  showPercentage = true,
  height = 'md',
  variant = 'default'
}: ProgressBarProps) => {
  const heightClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    destructive: 'bg-red-500'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {showPercentage && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
      )}
      
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', heightClasses[height])}>
        <div 
          className={cn(
            'h-full transition-all duration-500 ease-in-out rounded-full',
            variantClasses[variant]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};