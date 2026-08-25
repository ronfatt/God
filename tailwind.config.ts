/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tianji: {
          bg: "#060709",
          dark: "#0a0c10",
          card: "#12151c",
          gold: "#D4AF37",
          goldLight: "#F3E5AB",
          goldDark: "#997A15",
          red: "#881326",
          redGlow: "#E11D48",
          jade: "#1B4D3E",
          jadeLight: "#2DD4BF",
          jadeGlow: "#10B981",
          purple: "#2D124D",
          purpleLight: "#A855F7",
          purpleGlow: "#9333EA",
          amber: "#B45309",
          border: "#2A2E39",
          muted: "#8E95A5",
        }
      },
      fontFamily: {
        serif: ["Noto Serif SC", "Songti SC", "SimSun", "STSong", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-breathe': 'glowBreathe 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowBreathe: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.25), inset 0 0 15px rgba(212, 175, 55, 0.15)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.6), inset 0 0 25px rgba(212, 175, 55, 0.35)' },
        }
      }
    },
  },
  plugins: [],
}
