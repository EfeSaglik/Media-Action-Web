/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'media-navy': '#001D3D',
        'media-light': '#003566',
        'dark-bg': '#050505', // Apple tarzı daha derin siyah
        'dark-card': '#161618',
        'canvas': '#f5f5f7',
        'slate-dark': '#0f172a',
      },
      keyframes: {
        // Mevcut Şekil Animasyonları
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '50%': { transform: 'translate(-30px, 40px) rotate(10deg)' },
        },
        // Yeni Estetik Animasyonlar
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        aurora: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 30% / 50% 60% 30% 60%' },
        }
      },
      animation: {
        // Mevcutlar
        'spin-slow': 'spinSlow 60s linear infinite',
        'spin-reverse-slow': 'spinSlow 50s linear infinite reverse',
        'float-slow': 'floatSlow 20s ease-in-out infinite',
        // Yeniler
        'shimmer': 'shimmer 3s infinite linear',
        'aurora': 'aurora 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}