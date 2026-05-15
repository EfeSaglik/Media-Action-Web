import React from 'react';
import { motion } from 'framer-motion';

const TechStack = () => {
    const techs = [
        { name: 'React', icon: '⚛️', desc: 'Modern Web Arayüzleri' },
        { name: 'Python', icon: '🐍', desc: 'Veri Analizi & AI' },
        { name: 'Tailwind', icon: '🎨', desc: 'Hızlı & Esnek Tasarım' },
        { name: 'Framer', icon: '✨', desc: 'Akıcı Animasyonlar' },
        { name: 'Firebase', icon: '🔥', desc: 'Bulut Veritabanı' },
        { name: 'Node.js', icon: '🚀', desc: 'Performanslı Backend' }
    ];

    return (
        <section className="py-24 bg-white dark:bg-dark-bg overflow-hidden transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-media-navy dark:text-white tracking-tighter">
                        Teknoloji Yığınımız
                    </h2>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
                        Media Action projelerinde kullandığımız modern ve güçlü teknolojiler.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {techs.map((tech, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-canvas dark:bg-dark-card p-6 rounded-[2.5rem] flex flex-col items-center text-center border border-slate-100 dark:border-white/5"
                        >
                            <span className="text-4xl mb-4">{tech.icon}</span>
                            <h4 className="font-bold dark:text-white text-sm">{tech.name}</h4>
                            <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{tech.desc}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStack;