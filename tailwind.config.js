/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0F',
          surface: '#12121A',
          card: '#1A1A26',
          elevated: '#20202E',
        },
        accent: {
          lime: '#C6F135',
          'lime-dim': '#A8D020',
          blue: '#4F8EF7',
          emerald: '#34C98B',
        },
        text: {
          primary: '#F0F0F5',
          secondary: '#A0A0B0',
          muted: '#5A5A70',
        },
        border: {
          DEFAULT: '#2A2A3A',
          light: '#3A3A4A',
        },
        sport: {
          gym: '#FF6B35',
          running: '#4F8EF7',
          football: '#34C98B',
          basketball: '#FF9F1C',
          tennis: '#C6F135',
          boxing: '#E8445A',
          cycling: '#7C3AED',
          swimming: '#06B6D4',
          calisthenics: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        'card': '0 20px 60px rgba(0,0,0,0.5)',
        'card-hover': '0 30px 80px rgba(0,0,0,0.6)',
        'glow-lime': '0 0 30px rgba(198,241,53,0.25)',
        'glow-blue': '0 0 30px rgba(79,142,247,0.25)',
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.95) 100%)',
        'gradient-lime': 'linear-gradient(135deg, #C6F135, #A8D020)',
        'gradient-hero': 'linear-gradient(135deg, #1A1A26 0%, #0A0A0F 100%)',
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
