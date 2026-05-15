import React from 'react';

const Partners = () => {
    const partners = [
        "Bandırma Onyedi Eylül Üni.", "Sca Social", "Bahçeşehir Koleji", "TED Koleji", "Şampiyonlar Satranç"
    ];

    return (
        <section className="py-16 bg-canvas/30 dark:bg-dark-bg transition-colors border-y border-slate-100 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-10">
                    GÜÇLÜ İŞ BİRLİKLERİMİZ
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 dark:opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    {partners.map((partner, i) => (
                        <span key={i} className="text-xl md:text-2xl font-black text-media-navy dark:text-white transition-all cursor-default hover:opacity-100">
                            {partner}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;