import React from 'react';

export interface VoteProgressProps {
  /** Total number of votes */
  totalVotes: number;
  /** Current user's votes */
  userVotes: number;
  /** Maximum votes allowed per user */
  maxVotes: number;
  /** Progress percentage (optional, calculated if not provided) */
  percentage?: number;
  /** Size of the progress bar */
  size?: 'sm' | 'md' | 'lg';
  /** Show numeric labels */
  showLabels?: boolean;
  /** Custom className */
  className?: string;
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const sizeClasses = {
  sm: {
    container: 'h-2',
    bar: 'h-2',
    text: 'text-xs',
    label: 'text-xs',
  },
  md: {
    container: 'h-4',
    bar: 'h-4',
    text: 'text-sm',
    label: 'text-sm',
  },
  lg: {
    container: 'h-6',
    bar: 'h-6',
    text: 'text-base',
    label: 'text-base',
  },
};

const variantColors = {
  default: {
    bar: 'bg-gradient-to-r from-purple-500 to-pink-500',
    text: 'text-purple-600',
  },
  success: {
    bar: 'bg-gradient-to-r from-green-400 to-green-600',
    text: 'text-green-600',
  },
  warning: {
    bar: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    text: 'text-yellow-600',
  },
  danger: {
    bar: 'bg-gradient-to-r from-red-400 to-red-600',
    text: 'text-red-600',
  },
};

export const VoteProgress: React.FC<VoteProgressProps> = ({
  totalVotes,
  userVotes,
  maxVotes,
  percentage: propPercentage,
  size = 'md',
  showLabels = true,
  className = '',
  variant = 'default',
}) => {
  const sizes = sizeClasses[size];
  const colors = variantColors[variant];
  
  // Calculate percentage (user votes / max votes)
  const progressPercentage = propPercentage ?? Math.round((userVotes / maxVotes) * 100);
  
  // Format numbers
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) {
      return '0';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Label and count */}
      {showLabels && (
        <div className="flex items-center justify-between mb-2">
          <span className={`font-medium ${sizes.label} text-gray-700`}>
            Progression des votes
          </span>
          <span className={`font-bold ${sizes.text} ${colors.text}`}>
            {userVotes} / {maxVotes} ({progressPercentage}%)
          </span>
        </div>
      )}

      {/* Progress bar container */}
      <div className={`w-full ${sizes.container} bg-gray-200 rounded-full overflow-hidden`}>
        {/* Animated progress bar */}
        <div
          className={`${sizes.bar} ${colors.bar} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>

      {/* Total votes info */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          {formatNumber(totalVotes)} votes au total
        </span>
        <span className={`text-xs ${userVotes >= maxVotes ? 'text-red-500' : 'text-green-500'}`}>
          {userVotes >= maxVotes 
            ? 'Maximum atteint' 
            : `${maxVotes - userVotes} vote(s) restant(s)`}
        </span>
      </div>

      {/* Animated dots decoration for large progress bars */}
      {size === 'lg' && progressPercentage > 0 && progressPercentage < 100 && (
        <div className="flex items-center gap-1 mt-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  );
};

// Alternative: Simple circular progress version
export interface CircularVoteProgressProps {
  userVotes: number;
  maxVotes: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const CircularVoteProgress: React.FC<CircularVoteProgressProps> = ({
  userVotes,
  maxVotes,
  size = 80,
  strokeWidth = 6,
  showPercentage = true,
  variant = 'default',
  className = '',
}) => {
  const percentage = Math.round((userVotes / maxVotes) * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const colors = {
    default: '#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  };

  const trackColor = '#E5E7EB';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{percentage}%</span>
        </div>
      )}
    </div>
  );
};

// Mini vote progress for cards
export interface MiniVoteProgressProps {
  votes: number;
  maxVotes: number;
  className?: string;
}

export const MiniVoteProgress: React.FC<MiniVoteProgressProps> = ({
  votes,
  maxVotes,
  className = '',
}) => {
  const percentage = Math.round((votes / maxVotes) * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{votes} votes</span>
        <span className="text-xs text-gray-400">{percentage}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default VoteProgress;

