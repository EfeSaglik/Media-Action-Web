import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
    const stats = [
        { label: 'Aktif Üye', value: '150+' },
        { label: 'Proje', value: '12+' },
        { label: 'Etkinlik', value: '45+' }
    ];

    return (
        <section className="py-20 bg-canvas dark:bg-dark-bg transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                delay: i * 0.2
                            }}
                            className="text-center group"
                        >
                            <h3 className="text-6xl font-black text-media-navy dark:text-media-light mb-2 tracking-tighter transition-colors group-hover:scale-110 duration-300">
                                {stat.value}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm transition-colors">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;