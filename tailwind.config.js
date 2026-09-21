/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-main)',
        surface: 'var(--bg-surface)',
        'surface-card': 'var(--bg-surface-card)',
        'surface-border': 'var(--bg-surface-border)',
        white: 'var(--text-primary)',
        'static-white': '#ffffff',
        main: 'var(--text-primary)',
        muted: 'var(--text-secondary)',
        faint: 'var(--text-muted)',
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        slate: {
          100: 'var(--text-primary)',
          200: 'var(--text-primary)',
          300: 'var(--text-secondary)',
          400: 'var(--text-muted)',
          500: 'var(--text-faint)',
          600: 'var(--bg-surface-border)',
          700: 'var(--bg-surface-border)',
          800: 'var(--bg-surface-card)',
          900: 'var(--bg-surface)'
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          cyan: '#06B6D4',
          violet: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
