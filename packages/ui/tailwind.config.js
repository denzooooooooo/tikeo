const config = {
    darkMode: ['class'],
    content: [
        './src/**/*.{ts,tsx}',
        '../../apps/web/app/**/*.{ts,tsx}',
        '../../apps/admin/app/**/*.{ts,tsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: {
                    DEFAULT: '#FFFFFF',
                    secondary: '#F7F8FA',
                },
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: '#5B7CFF',
                    foreground: '#FFFFFF',
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#5B7CFF',
                    600: '#4F46E5',
                    700: '#4338CA',
                    800: '#3730A3',
                    900: '#312E81',
                },
                accent: {
                    DEFAULT: '#7B61FF',
                    gradient: {
                        from: '#7B61FF',
                        to: '#5B7CFF',
                    },
                },
                text: {
                    primary: '#111827',
                    secondary: '#6B7280',
                },
                success: {
                    DEFAULT: '#16A34A',
                    light: '#BBF7D0',
                    dark: '#15803D',
                },
                error: {
                    DEFAULT: '#DC2626',
                    light: '#FECACA',
                    dark: '#991B1B',
                },
                warning: {
                    DEFAULT: '#F59E0B',
                    light: '#FDE68A',
                    dark: '#B45309',
                },
                info: {
                    DEFAULT: '#3B82F6',
                    light: '#BFDBFE',
                    dark: '#1E40AF',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderRadius: {
                lg: '14px',
                md: '10px',
                sm: '6px',
            },
            fontFamily: {
                sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
                display: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'display-xl': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
                'display-lg': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
                'display-md': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
                'display-sm': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
                'heading-xl': ['20px', { lineHeight: '1.5', fontWeight: '600' }],
                'heading-lg': ['18px', { lineHeight: '1.5', fontWeight: '600' }],
                'heading-md': ['16px', { lineHeight: '1.5', fontWeight: '600' }],
                'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
                'body-md': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
                'body-sm': ['12px', { lineHeight: '1.6', fontWeight: '400' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                'premium': '0 8px 32px rgba(91, 124, 255, 0.12)',
                'glow': '0 0 20px rgba(91, 124, 255, 0.3)',
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.2s ease-out',
                'fade-out': 'fade-out 0.2s ease-out',
                'slide-in': 'slide-in 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                'slide-out': 'slide-out 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                'scale-in': 'scale-in 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'fade-out': {
                    from: { opacity: '1' },
                    to: { opacity: '0' },
                },
                'slide-in': {
                    from: { transform: 'translateY(10px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-out': {
                    from: { transform: 'translateY(0)', opacity: '1' },
                    to: { transform: 'translateY(10px)', opacity: '0' },
                },
                'scale-in': {
                    from: { transform: 'scale(0.95)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            transitionTimingFunction: {
                'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
module.exports = config;
//# sourceMappingURL=tailwind.config.js.map