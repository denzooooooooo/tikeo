import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const colorMap = {
  primary: 'border-t-tikeo-primary',
  white: 'border-t-white',
  gray: 'border-t-gray-500',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-200 ${sizeMap[size]} ${colorMap[color as keyof typeof colorMap] || colorMap.primary} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const LoadingOverlay: React.FC<{ message?: string }> = ({
  message = 'Chargement...',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-8 shadow-lg">
        <LoadingSpinner size="lg" color="primary" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export const LoadingCard: React.FC = () => {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-48 w-full rounded-lg bg-gray-200" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
  );
};

export const LoadingButton: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  loading,
  children,
  className = '',
  disabled,
  onClick,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`relative ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
      <div className={loading ? 'invisible' : ''}>{children}</div>
    </button>
  );
};

export default LoadingSpinner;

