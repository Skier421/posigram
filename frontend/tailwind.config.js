/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'fire-flicker': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-2%) scale(1.03)' },
        },
        'fire-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(251,146,60,0.18)' },
          '50%': { boxShadow: '0 0 24px 8px rgba(251,146,60,0.26)' },
        },
        'support-bounce': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        'support-ring': {
          '0%': { opacity: '0.8', transform: 'scale(0.6)' },
          '100%': { opacity: '0', transform: 'scale(2.4)' },
        },
      },
      animation: {
        'fire-flicker': 'fire-flicker 1.6s ease-in-out infinite',
        'fire-glow': 'fire-glow 2.6s ease-in-out infinite',
        'support-bounce': 'support-bounce 0.22s ease-out',
        'support-ring': 'support-ring 0.42s ease-out forwards',
      },
    },
  },
  plugins: [],
};
