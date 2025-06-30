/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7C9885",
        secondary: "#E8F5E9",
        accent: "#5B8C6E",
        surface: "#FFFFFF",
        background: "#FAFBFA",
        sage: {
          50: "#F3F6F4",
          100: "#E8F5E9",
          200: "#C5E1C7",
          300: "#A2CDA5",
          400: "#8BB88E",
          500: "#7C9885",
          600: "#6B8471",
          700: "#5B8C6E",
          800: "#4A7359",
          900: "#3E5F48"
        },
        forest: {
          50: "#F4F6F5",
          100: "#E9ECEB",
          200: "#C8D0CC",
          300: "#A7B5AD",
          400: "#869A8E",
          500: "#5B8C6E",
          600: "#52795E",
          700: "#48664F",
          800: "#3E533F",
          900: "#334030"
        }
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(124, 152, 133, 0.1)',
        'gentle': '0 4px 12px rgba(124, 152, 133, 0.15)',
        'lift': '0 8px 25px rgba(124, 152, 133, 0.2)'
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}