import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// --- BULUT BAĞLANTISINI EKLEDİK ---
import { db } from '../firebase'; // firebase.js src klasöründe olduğu için yol aynı kaldı
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Kart içindeki Mini Slider Bileşeni (Aynen Korundu)
const ImageSlider = ({ images, title }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000); // 3 saniyede bir kayar
        return () => clearInterval(timer);
    }, [images]);

    if (!images || images.length === 0) return <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl">🖼️</div>;

    return (
        <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.img
                    key={index}
                    src={images[index]}
                    alt={title}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Alt taraftaki noktalar (dots) */}
            {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-4 bg-white' : 'w-1 bg-white/40'}`} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Events = () => {
    const [events, setEvents] = useState([]);

    // --- BULUTTAN ETKİNLİKLERİ ÇEKEN YENİ YAPI ---
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Etkinlikleri buluttan oluşturulma tarihine göre (en yeni en üstte) sıralayarak çekiyoruz
                const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);

                // Gelen dökümanları id'leriyle birlikte diziye dönüştürüyoruz
                const eventsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setEvents(eventsList);
            } catch (error) {
                console.error("Etkinlikler buluttan çekilirken hata oluştu:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <section id="etkinlikler" className="py-32 bg-canvas dark:bg-dark-bg transition-colors duration-500 px-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-media-navy dark:text-white tracking-tighter mb-4">Etkinlik Takvimi</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium transition-colors">
                        Sadece Bandırma'da değil, dijitalin olduğu her yerdeyiz.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, idx) => (
                        <motion.div
                            key={event.id || idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group bg-white dark:bg-dark-card p-6 rounded-[3rem] border border-slate-50 dark:border-white/5 hover:shadow-antigravity transition-all duration-500 flex flex-col h-full relative"
                        >
                            {/* GÖRSEL ALANI - SLIDER BURADA ÇALIŞIYOR */}
                            <div className="relative w-full h-56 mb-6 overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800">
                                <ImageSlider images={event.images} title={event.title} />
                                <div className="absolute top-4 right-4 z-20">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${event.status === 'Tamamlandı' ? 'bg-white/80 text-slate-500' : 'bg-media-light/80 text-white'}`}>
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            <div className="px-2 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{event.icon}</span>
                                    <span className="text-xs font-bold text-media-light uppercase tracking-widest">{event.tag}</span>
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">{event.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-sm">{event.desc}</p>
                            </div>

                            <div className="mt-auto pt-6 px-2 border-t border-slate-50 dark:border-white/5 flex flex-col gap-4">
                                <span className="text-sm font-bold text-slate-400">{event.date}</span>
                                {event.status !== 'Tamamlandı' ? (
                                    <a href={event.formUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-[#1d1d1f] dark:bg-white text-white dark:text-dark-bg text-center rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.02] transition-all">Kayıt Ol</a>
                                ) : (
                                    <button disabled className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-bold text-sm cursor-not-allowed">Katılım Kapandı</button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Events;