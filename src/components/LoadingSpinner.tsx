import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  showText?: boolean;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  className = '',
  text = 'Carregando...',
  showText = false 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-2 border-primary/20 border-t-primary",
          sizeClasses[size]
        )} 
      />
      {showText && text && (
        <p className="mt-2 text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Full screen loading spinner
export const FullScreenSpinner = ({ text = 'Carregando...' }: { text?: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
    <LoadingSpinner size="xl" text={text} showText />
  </div>
);

// Inline loading spinner
export const InlineSpinner = ({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) => (
  <LoadingSpinner size={size} className="inline-flex" />
);
