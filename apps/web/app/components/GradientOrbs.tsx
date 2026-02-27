'use client';

import React from 'react';

interface Orb {
  color: string;
  opacity: number;
  size: string;
  position: string;
  blur: string;
  animate?: boolean;
  delay?: string;
}

interface GradientOrbsProps {
  variant?: 'primary' | 'subtle' | 'dark';
  count?: number;
}

export default function GradientOrbs({ variant = 'primary', count = 3 }: GradientOrbsProps) {
  const getOrbs = (): Orb[] => {
    switch (variant) {
      case 'subtle':
        return [
          { 
            color: '#5B7CFF', 
            opacity: 0.1, 
            size: 'w-96 h-96', 
            position: 'top-20 left-10',
            blur: 'blur-3xl'
          },
          { 
            color: '#7B61FF', 
            opacity: 0.08, 
            size: 'w-80 h-80', 
            position: 'top-40 right-20',
            blur: 'blur-3xl'
          },
          { 
            color: '#A8D4FF', 
            opacity: 0.1, 
            size: 'w-64 h-64', 
            position: 'bottom-20 left-1/3',
            blur: 'blur-3xl'
          },
        ];
      case 'dark':
        return [
          { 
            color: '#5B7CFF', 
            opacity: 0.15, 
            size: 'w-72 h-72', 
            position: 'top-10 left-1/4',
            blur: 'blur-3xl'
          },
          { 
            color: '#7B61FF', 
            opacity: 0.1, 
            size: 'w-96 h-96', 
            position: 'bottom-0 right-0',
            blur: 'blur-3xl'
          },
        ];
      case 'primary':
      default:
        return [
          { 
            color: '#5B7CFF', 
            opacity: 0.2, 
            size: 'w-64 h-64', 
            position: 'top-20 left-10',
            blur: 'blur-[100px]',
            animate: true
          },
          { 
            color: '#7B61FF', 
            opacity: 0.2, 
            size: 'w-96 h-96', 
            position: 'bottom-20 right-10',
            blur: 'blur-[100px]',
            animate: true,
            delay: 'animation-delay-2000'
          },
          { 
            color: '#A8D4FF', 
            opacity: 0.15, 
            size: 'w-64 h-64', 
            position: 'top-1/2 left-1/2',
            blur: 'blur-[80px]',
            animate: true,
            delay: 'animation-delay-4000'
          },
        ];
    }
  };

  const orbs = getOrbs().slice(0, count);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, index) => (
        <div
          key={index}
          className={`absolute rounded-full mix-blend-multiply ${orb.size} ${orb.position} ${orb.blur} ${orb.animate ? 'animate-blob' : ''} ${orb.delay || ''}`}
          style={{
            backgroundColor: orb.color,
            opacity: orb.opacity,
          }}
        />
      ))}
    </div>
  );
}

// Fixed position orbs for specific sections
export function HeroOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute top-20 left-10 w-72 h-72 bg-[#5B7CFF] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"
      />
      <div 
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#7B61FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A8D4FF] rounded-full mix-blend-multiply filter blur-[80px] opacity-15 animate-blob animation-delay-4000"
      />
    </div>
  );
}

export function SectionOrbs({ position = 'center' }: { position?: 'left' | 'right' | 'center' }) {
  const getPosition = () => {
    switch (position) {
      case 'left':
        return 'left-0';
      case 'right':
        return 'right-0';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div className={`absolute ${getPosition()} top-0 w-96 h-96 overflow-hidden pointer-events-none`}>
      <div className="absolute top-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
    </div>
  );
}

export function StatsOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
    </div>
  );
}
