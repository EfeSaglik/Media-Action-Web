import React from 'react';
import { motion } from 'framer-motion';

const Tuzuk = () => {
    const maddeler = [
        { baslik: "Madde 1: Topluluk Amacı", icerik: "Media Action Topluluğu, üniversite öğrencilerinin medya, dijital iletişim, teknoloji ve içerik üretimi alanlarında kendilerini geliştirmelerini, teorik bilgilerini pratiğe dökmelerini ve sektörel bir ağ kurmalarını amaçlar." },
        { baslik: "Madde 2: Üyelik Şartları", icerik: "Bandırma Onyedi Eylül Üniversitesi'ne kayıtlı her öğrenci topluluğa üye olabilir. Üyelik için dijital medya ve teknolojiye ilgi duymak, topluluk etkinliklerine katılım göstermek esastır." },
        { baslik: "Madde 3: Yönetim Kurulu", icerik: "Yönetim kurulu; başkan, başkan yardımcısı, genel sekreter ve departman sorumlularından oluşur. Kararlar oy çokluğu ile alınır." },
        { baslik: "Madde 4: Departmanlar", icerik: "Topluluk bünyesinde Yazılım, Görsel Tasarım, Sosyal Medya Yönetimi ve Organizasyon departmanları bulunur. Her üye yeteneğine göre bu birimlerde görev alır." }
    ];

    return (
        <section className="py-32 bg-canvas dark:bg-dark-bg min-h-screen px-6 transition-colors duration-500">
            <div className="max-w-4xl mx-auto">

                {/* Başlık */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-media-navy dark:text-white tracking-tighter mb-4">
                        Topluluk Tüzüğü
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Media Action'ın temel ilkeleri ve işleyiş kuralları.
                    </p>
                </motion.div>

                {/* Tüzük İçeriği */}
                <div className="space-y-12">
                    {maddeler.map((madde, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm"
                        >
                            <h3 className="text-2xl font-extrabold text-media-light mb-4 tracking-tight">
                                {madde.baslik}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {madde.icerik}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Alt Not */}
                <p className="mt-16 text-center text-sm text-slate-400 font-medium italic">
                    *Bu tüzük Media Action Yönetim Kurulu tarafından güncellenebilir.
                </p>
            </div>
        </section>
    );
};

export default Tuzuk;