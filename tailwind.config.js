/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      colors: {
        'terminal-black': '#000000',
        'terminal-white': '#ffffff',
        'terminal-green': '#00ff00',
      },
      animation: {
        'blink': 'blink 1s infinite',
        'scanline': 'scanline 2s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      }
    },
  },
  plugins: [],
}