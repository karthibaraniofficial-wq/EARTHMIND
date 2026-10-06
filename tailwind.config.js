/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          deep: '#071A2B',
          ocean: '#087EA4',
          aqua: '#18C8C8',
          emerald: '#27C98A',
          leaf: '#75D66A',
          sky: '#4FA8FF',
          climate: '#6C8CFF',
          aurora: '#9B7CFF',
          sun: '#FFD166',
          coral: '#FF6B6B',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'radial-aurora': 'radial-gradient(circle at 50% 20%, rgba(24, 200, 200, 0.15) 0%, rgba(155, 124, 255, 0.12) 35%, rgba(7, 26, 43, 0.95) 75%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'glass-highlight': 'linear-gradient(135deg, rgba(24, 200, 200, 0.15) 0%, rgba(155, 124, 255, 0.05) 100%)',
      },
      boxShadow: {
        'glass-1': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px rgba(24, 200, 200, 0.25)',
        'aurora-glow': '0 0 35px rgba(155, 124, 255, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
