import React from 'react';
import { AlertCircleIcon, CloseIcon } from './Icons';

export interface ErrorAlertProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning' | 'info' | 'success';
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  showIcon?: boolean;
}

const variantStyles = {
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
    message: 'text-red-700',
    iconBg: 'bg-red-100',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    iconBg: 'bg-yellow-100',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    message: 'text-blue-700',
    iconBg: 'bg-blue-100',
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-500',
    title: 'text-green-800',
    message: 'text-green-700',
    iconBg: 'bg-green-100',
  },
};

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title,
  message,
  variant = 'error',
  onDismiss,
  actionLabel,
  onAction,
  className = '',
  showIcon = true,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${styles.container} ${className}`}
      role="alert"
    >
      {showIcon && (
        <div className={`shrink-0 rounded-full p-1.5 ${styles.iconBg}`}>
          <AlertCircleIcon className={`h-5 w-5 ${styles.icon}`} />
        </div>
      )}
      <div className="flex-1">
        {title && (
          <h4 className={`font-medium ${styles.title}`}>{title}</h4>
        )}
        <p className={`mt-1 text-sm ${styles.message}`}>{message}</p>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className={`mt-3 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${styles.iconBg.replace('bg-', 'bg-').replace('-100', '-600')}`}
          >
            {actionLabel}
          </button>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`shrink-0 rounded p-1 transition-colors hover:bg-black/5 ${styles.icon}`}
          aria-label="Dismiss"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const InlineError: React.FC<{ message?: string; className?: string }> = ({
  message,
  className = '',
}) => {
  if (!message) return null;

  return (
    <p className={`mt-1 text-sm text-red-600 ${className}`}>
      <span className="flex items-center gap-1">
        <AlertCircleIcon className="h-3 w-3" />
        {message}
      </span>
    </p>
  );
};

export const PageError: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
}> = ({
  title = 'Une erreur est survenue',
  message = 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
  onRetry,
}) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-red-100 p-4">
        <AlertCircleIcon className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-gray-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-lg bg-tikeo-primary px-6 py-2 text-white transition-colors hover:bg-tikeo-primary/90"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, description, icon, action, className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center ${className}`}
    >
      {icon && <div className="text-gray-400">{icon}</div>}
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default ErrorAlert;

