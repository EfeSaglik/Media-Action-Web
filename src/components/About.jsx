import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="hakkimizda" className="py-24 bg-white dark:bg-dark-bg transition-colors duration-500 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* Sol Taraf - Biz Kimiz Kartı (Soldan Gelir) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-media-light/20 rounded-[2.5rem] transform rotate-3"></div>
          <div className="relative bg-canvas dark:bg-dark-card p-10 rounded-[2.5rem] shadow-antigravity dark:shadow-none border border-slate-100 dark:border-white/5">
            <h3 className="text-3xl font-extrabold text-media-navy dark:text-white mb-4 tracking-tight transition-colors">Biz Kimiz?</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 font-medium transition-colors">
              Bandırma Onyedi Eylül Üniversitesi'nde dijital medya, içerik üretimi ve teknoloji odaklı iletişim stratejilerini bir araya getiren yenilikçi bir topluluğuz.
            </p>
          </div>
        </motion.div>

        {/* Sağ Taraf - Neler Yapıyoruz (Sağdan ve Sırayla Gelir) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-extrabold text-media-navy dark:text-white mb-10 tracking-tight transition-colors">Neler Yapıyoruz?</h2>
          <div className="space-y-8">
            {[
              { icon: '🎬', title: 'Dijital İçerik Üretimi', desc: 'Topluluğumuz için eğlenceli içerikler üretiyoruz.' },
              { icon: '🚀', title: 'Çevre İletişimi', desc: 'Okulun en aktif sosyal medya topluluğuyuz .' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.2) }}
                className="flex gap-6 items-start group"
              >
                <div className="w-14 h-14 rounded-2xl bg-canvas dark:bg-dark-card text-media-light flex items-center justify-center shrink-0 shadow-sm border border-transparent dark:border-white/5 transition-all group-hover:scale-110">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xl mb-1 transition-colors">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;