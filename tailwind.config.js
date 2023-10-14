/* eslint-disable prettier/prettier */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    borderRadius: {
      DEFAULT: '10px',
      sm: '8px',
      full: '100%',
    },
    animation: {
      'animate-image': 'fade-in 1s ease-out',
    },
    keyframes: {
      'fade-in': {
        from: {
          opacity: '0',
        },
        to: {
          opacity: '1',
        },
      }
    },
    fontSize: {
      DEFAULT: ['1rem', '1.5rem'],
      article: ['1rem', '1.175rem'],
      secondary: ['0.875rem', '1.05rem'],
      title: ['1.25rem', '1.75rem'],
    },
    screens: {
      mobile: '550px',
      tablet: '834px',
      desktop: '1024px',
    },
    fontFamily: {
      display: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      body: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      monospace: ['IBM Plex Mono', 'system-ui', 'monospace'],
    },
    colors: {
      dark: {
        DEFAULT: '#080808',
        headlines: '#E1E1E1',
        text: '#B1B1B1',
        secondary: '#FAFAFA',
        'subtle-edges': '#27272A',
        'primary-hover': '#856ADE',
        'primary-pressed': '#A28DE6',
        'tertiary-hover': '#555555',
        'tertiary-pressed': '#7D7D7D',
      },
      light: {
        DEFAULT: '#F8F8FA',
        headlines: '#0D0D0D',
        text: '#5E5E5E',
        secondary: '#09090B',
        'subtle-edges': '#e4e4e7',
        'primary-hover': '#6246CC',
        'primary-pressed': '#4A36B9',
        'tertiary-hover': '#313131',
        'tertiary-pressed': '#282828',
      },
      transparent: 'transparent',
      primary: '#7050D8',
      tertiary: '#373737'
    },
    animation: {
      'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    keyframes: {
      pulse: {
        "0%, 100%": {
          opacity: 1,
        },
        "50%": {
          opacity: 0.4,
        }
      }
    }
  },
  plugins: [],
};
