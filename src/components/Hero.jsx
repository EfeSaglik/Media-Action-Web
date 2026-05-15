import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#fbfbfd] dark:bg-[#050505] transition-colors duration-1000 pt-20">
      
      {/* --- ARKA PLAN AURORA --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-100/40 dark:bg-media-light/10 rounded-full blur-[120px] animate-aurora" />
        <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/40 dark:bg-blue-900/10 rounded-full blur-[100px] animate-aurora [animation-delay:2s]" />
      </div>

      {/* --- ANA İÇERİK --- */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-6 flex flex-col items-center justify-center flex-1">
        
        {/* LOGO KUTUSU */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8 md:mb-12"
        >
          <div className="absolute inset-0 bg-media-light/20 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2.5rem] shadow-xl flex items-center justify-center p-4">
            <div className="flex flex-col items-center select-none">
              <span className="text-media-navy dark:text-media-light font-black text-xl tracking-tighter">MEDIA</span>
              <div className="w-10 h-0.5 bg-media-navy/20 dark:bg-media-light/30 my-1" />
              <span className="text-slate-800 dark:text-white font-black text-lg tracking-widest">ACTION</span>
            </div>
          </div>
        </motion.div>

        {/* BAŞLIK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] mb-4 block">
            Bandırma Onyedi Eylül Üniversitesi
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] dark:text-white mb-6">
            MEDIA <span className="bg-clip-text text-transparent bg-gradient-to-r from-media-navy via-blue-500 to-media-navy dark:from-media-light dark:via-white dark:to-media-light bg-[length:200%_auto] animate-shimmer">ACTION</span><br />
            <span className="text-4xl md:text-6xl font-extrabold opacity-80">TOPLULUĞU</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium leading-relaxed mb-10">
            Medya ve teknolojinin kesişim noktasında, yaratıcılığı dijitalle birleştiriyoruz.
          </p>
        </motion.div>

        {/* BUTONLAR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="w-full sm:w-auto px-10 py-4 bg-[#1d1d1f] dark:bg-white text-white dark:text-black rounded-full font-bold text-md shadow-lg hover:scale-105 transition-all">
            Aramıza Katıl
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full font-bold text-md text-slate-700 dark:text-white hover:bg-white/80 transition-all">
            Projeleri İncele
          </button>
        </motion.div>
      </div>

      {/* --- ALT İNDİKATÖR (Yazısız Temiz Versiyon) --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div 
          animate={{ y: [0, 12, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-0.5 h-8 bg-gradient-to-b from-media-light dark:from-white to-transparent rounded-full"
        />
      </motion.div>

    </section>
  );
};

export default Hero;