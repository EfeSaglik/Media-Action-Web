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
        'dark-bg': '#050505',
        'dark-card': '#161618',
        'canvas': '#f5f5f7',
        'slate-dark': '#0f172a',
      },
      // --- PERFORMANS VE ESTETİK İÇİN YENİ EKLENEN GEÇİŞ AYARLARI ---
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.28, 0.11, 0.32, 1)', // Apple'ın pürüzsüz ivmelenmesi
        'apple-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'default': '500ms',
      },
      // -----------------------------------------------------------
      keyframes: {
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // floatSlow: translateZ(0) ekleyerek ekran kartını zorunlu kılıyoruz
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(-30px, 40px, 0) rotate(10deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Aurora: Border-radius değişimi ağır bir işlemdir, 
        // transform-gpu ile desteklenmesi gerekir (JSX tarafında yaptık).
        aurora: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 30% / 50% 60% 30% 60%' },
        }
      },
      animation: {
        'spin-slow': 'spinSlow 60s linear infinite',
        'spin-reverse-slow': 'spinSlow 50s linear infinite reverse',
        'float-slow': 'floatSlow 20s ease-apple-in-out infinite',
        'shimmer': 'shimmer 3s infinite linear',
        'aurora': 'aurora 20s ease-apple-in-out infinite',
      },
    },
  },
  plugins: [],
}