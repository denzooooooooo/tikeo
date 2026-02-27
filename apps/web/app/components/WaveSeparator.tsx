'use client';

import React from 'react';

interface WaveSeparatorProps {
  variant?: 'light' | 'dark' | 'gradient';
  flip?: boolean;
}

export default function WaveSeparator({ variant = 'gradient', flip = false }: WaveSeparatorProps) {
  const getColors = () => {
    switch (variant) {
      case 'light':
        return {
          fill: '#F8FAFC',
          shadow: '#E2E8F0'
        };
      case 'dark':
        return {
          fill: '#0F172A',
          shadow: '#1E293B'
        };
      case 'gradient':
      default:
        return {
          primary: '#5B7CFF',
          secondary: '#7B61FF',
          accent: '#A8D4FF'
        };
    }
  };

  const colors = getColors();

  if (variant === 'gradient') {
    return (
      <div className={`relative w-full h-24 ${flip ? 'rotate-180' : ''}`}>
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 60C120 90 240 90 360 75C480 60 600 30 720 35C840 40 960 70 1080 75C1200 80 1320 60 1440 55L1440 120L0 120Z"
            fill="url(#gradientWave)"
          />
          <defs>
            <linearGradient id="gradientWave" x1="0" y1="0" x2="1440" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5B7CFF" stopOpacity="0.1" />
              <stop offset="0.5" stopColor="#7B61FF" stopOpacity="0.15" />
              <stop offset="1" stopColor="#A8D4FF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-16 ${flip ? 'rotate-180' : ''}`}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 30C120 50 240 50 360 40C480 30 600 10 720 15C840 20 960 40 1080 45C1200 50 1320 35 1440 30L1440 60L0 60Z"
          fill={colors.fill}
        />
        {/* Subtle shadow/border effect */}
        <path
          d="M0 30C120 50 240 50 360 40C480 30 600 10 720 15C840 20 960 40 1080 45C1200 50 1320 35 1440 30"
          stroke={colors.shadow}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

// Curved separator variant
export function CurvedSeparator({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative w-full h-12 ${flip ? 'rotate-180' : ''}`}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 60C100 30 200 0 300 5C400 10 500 30 600 35C700 40 800 20 900 25C1000 30 1100 45 1200 50L1200 60H0Z"
          fill="url(#curveGradient)"
        />
        <defs>
          <linearGradient id="curveGradient" x1="0" y1="0" x2="1200" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5B7CFF" stopOpacity="0.05" />
            <stop offset="1" stopColor="#7B61FF" stopOpacity="0.08" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Triangle separator
export function TriangleSeparator({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`relative w-full h-8 ${flip ? 'rotate-180' : ''}`}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0L50 8L100 0H0Z"
          fill="url(#triangleGradient)"
        />
        <defs>
          <linearGradient id="triangleGradient" x1="0" y1="0" x2="100" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5B7CFF" stopOpacity="0.1" />
            <stop offset="1" stopColor="#7B61FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
