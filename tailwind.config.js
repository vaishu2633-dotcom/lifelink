/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          darkred: '#B71C1C',
          red: '#E53935',
          lightred: '#FFEBEE',
          borderred: '#FFCDD2',
          accent: '#D32F2F',
          dark: '#222222',
          bg: '#F7F7F9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 25px -3px rgba(183, 28, 28, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(183, 28, 28, 0.08)'
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' }
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(1)' }
        }
      },
      animation: {
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
