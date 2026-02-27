import type { Config } from 'tailwindcss';
import baseConfig from '../../packages/ui/tailwind.config';

const config: Config = {
  ...baseConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme?.extend,
      colors: {
        ...baseConfig.theme?.extend?.colors,
        // Glassmorphism Blues - Sky Theme
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          150: 'rgba(255, 255, 255, 0.15)',
          200: 'rgba(255, 255, 255, 0.2)',
          250: 'rgba(255, 255, 255, 0.25)',
          300: 'rgba(255, 255, 255, 0.3)',
          350: 'rgba(255, 255, 255, 0.35)',
          400: 'rgba(255, 255, 255, 0.4)',
          500: 'rgba(255, 255, 255, 0.5)',
          600: 'rgba(255, 255, 255, 0.6)',
          700: 'rgba(255, 255, 255, 0.7)',
          800: 'rgba(255, 255, 255, 0.8)',
          900: 'rgba(255, 255, 255, 0.9)',
        },
        // Primary Blues - Sky Ciel
        sky: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          150: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          450: '#0284C7',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        // Dark glass colors
        dark: {
          glass: 'rgba(15, 23, 42, 0.8)',
          50: 'rgba(15, 23, 42, 0.05)',
          100: 'rgba(15, 23, 42, 0.1)',
          200: 'rgba(15, 23, 42, 0.2)',
          300: 'rgba(15, 23, 42, 0.3)',
          400: 'rgba(15, 23, 42, 0.4)',
          500: 'rgba(15, 23, 42, 0.5)',
          600: 'rgba(15, 23, 42, 0.6)',
          700: 'rgba(15, 23, 42, 0.7)',
          800: 'rgba(15, 23, 42, 0.8)',
          900: 'rgba(15, 23, 42, 0.9)',
        },
        // Accent gradient
        accent: {
          blue: '#5B7CFF',
          purple: '#7B61FF',
          sky: '#A8D4FF',
          cyan: '#67E8F9',
        },
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.1) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 50%, #A8D4FF 100%)',
        'gradient-sky': 'linear-gradient(135deg, #0EA5E9 0%, #5B7CFF 50%, #7B61FF 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(230,100%,85%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(250,100%,90%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(220,100%,80%,1) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(260,100%,85%,1) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(240,100%,85%,1) 0px, transparent 50%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        glass: '20px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(91, 124, 255, 0.15)',
        'glass-sm': '0 4px 16px rgba(91, 124, 255, 0.1)',
        'glass-lg': '0 16px 48px rgba(91, 124, 255, 0.2)',
        'glow': '0 0 20px rgba(91, 124, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(91, 124, 255, 0.4)',
        'glow-strong': '0 0 60px rgba(91, 124, 255, 0.5)',
        'float': '0 20px 40px rgba(0, 0, 0, 0.1)',
        'inner-glow': 'inset 0 2px 4px rgba(91, 124, 255, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-glow-fast': 'pulse-glow 1s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'shimmer-slow': 'shimmer 3s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'gradient-slow': 'gradient 15s ease infinite',
        'blob': 'blob 7s infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(91, 124, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(91, 124, 255, 0.5)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'blob': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
      fontFamily: {
        ...baseConfig.theme?.extend?.fontFamily,
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body: ['Inter', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        ...baseConfig.theme?.extend?.fontSize,
        '10xl': ['10rem', { lineHeight: '1' }],
        '11xl': ['12rem', { lineHeight: '0.9' }],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
  plugins: [
    ...(baseConfig.plugins || []),
    require('tailwindcss-animate'),
  ],
};

export default config;

