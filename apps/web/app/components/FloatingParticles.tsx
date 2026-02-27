'use client';

import React from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const particles: Particle[] = [
  { id: 1, x: 10, y: 20, size: 4, duration: 8, delay: 0, opacity: 0.6 },
  { id: 2, x: 20, y: 60, size: 6, duration: 10, delay: 1, opacity: 0.4 },
  { id: 3, x: 35, y: 30, size: 3, duration: 7, delay: 2, opacity: 0.5 },
  { id: 4, x: 50, y: 70, size: 5, duration: 9, delay: 0.5, opacity: 0.3 },
  { id: 5, x: 65, y: 25, size: 4, duration: 8, delay: 1.5, opacity: 0.5 },
  { id: 6, x: 75, y: 55, size: 7, duration: 11, delay: 2.5, opacity: 0.4 },
  { id: 7, x: 85, y: 40, size: 3, duration: 6, delay: 0.8, opacity: 0.6 },
  { id: 8, x: 90, y: 80, size: 5, duration: 9, delay: 1.2, opacity: 0.3 },
  { id: 9, x: 15, y: 85, size: 4, duration: 7, delay: 2.2, opacity: 0.5 },
  { id: 10, x: 45, y: 15, size: 6, duration: 10, delay: 0.3, opacity: 0.4 },
  { id: 11, x: 60, y: 90, size: 3, duration: 8, delay: 1.8, opacity: 0.5 },
  { id: 12, x: 80, y: 10, size: 5, duration: 9, delay: 2.8, opacity: 0.3 },
];

export default function FloatingParticles({ count = 12, color = 'white' }: { count?: number; color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.slice(0, count).map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          }}
        />
      ))}
      
      {/* Larger accent particles */}
      <div 
        className="absolute rounded-full animate-float-delayed"
        style={{
          left: '25%',
          top: '40%',
          width: 12,
          height: 12,
          backgroundColor: '#5B7CFF',
          opacity: 0.3,
          animationDelay: '1s',
          filter: 'blur(2px)',
        }}
      />
      <div 
        className="absolute rounded-full animate-float"
        style={{
          left: '70%',
          top: '30%',
          width: 8,
          height: 8,
          backgroundColor: '#7B61FF',
          opacity: 0.4,
          animationDelay: '2s',
          filter: 'blur(1px)',
        }}
      />
      <div 
        className="absolute rounded-full animate-float-delayed"
        style={{
          left: '55%',
          top: '65%',
          width: 10,
          height: 10,
          backgroundColor: '#A8D4FF',
          opacity: 0.3,
          animationDelay: '0.5s',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}
