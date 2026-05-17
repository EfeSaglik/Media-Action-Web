import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// --- FIREBASE BAĞLANTILARI ---
import { db } from '../firebase'; // firebase.js dosyanın src altında olduğuna emin ol, yol doğru
import { collection, getDocs } from 'firebase/firestore';

const Team = () => {
    const [team, setTeam] = useState([]);

    // --- BULUTTAN EKİP VERİLERİNİ ÇEKEN VE SIRALAYAN YAPI ---
    useEffect(() => {
        const fetchTeam = async () => {
            try {
                // Firebase'den tüm ekibi çekiyoruz
                const querySnapshot = await getDocs(collection(db, 'team'));

                // Gelen üyeleri döküman ID'leriyle eşleyip, admin panelindeki sürükleme sırasına (order) göre diziyoruz
                // (a.order ?? 0) mantığı: Eğer eski üyelerde henüz order alanı yoksa onları 0 kabul edip listeyi bozmaz
                const teamList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

                setTeam(teamList);
            } catch (error) {
                console.error("Ekip verileri buluttan çekilirken hata oluştu:", error);
            }
        };

        fetchTeam();
    }, []);

    return (
        <section className="py-32 bg-canvas dark:bg-dark-bg px-6 min-h-screen transition-colors duration-500">
            <div className="max-w-7xl mx-auto text-center">

                {/* Başlık Grubu */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <h2 className="text-5xl md:text-6xl font-black text-media-navy dark:text-white tracking-tighter mb-4">
                        Ekibimiz
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        Medya, teknoloji ve yaratıcılığı bir araya getiren dinamik kadromuzla tanışın.
                    </p>
                </motion.div>

                {/* Üye Grid Yapısı - 18+ kişi için optimize edildi */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 md:gap-12">
                    {team.length === 0 ? (
                        <div className="col-span-full py-20 bg-white dark:bg-dark-card rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                            <p className="text-slate-400 font-bold">Henüz ekip üyesi eklenmedi.</p>
                        </div>
                    ) : (
                        team.map((member, idx) => (
                            <motion.div
                                key={member.id || idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ y: -10 }}
                                className="group flex flex-col items-center"
                            >
                                {/* Üye Fotoğrafı */}
                                <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
                                    {/* Arka Plan Dekoratif Çerçeve */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-media-light/20 to-transparent rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500" />

                                    {/* Ana Fotoğraf Alanı */}
                                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-white dark:border-white/10 shadow-2xl transition-all group-hover:shadow-media-light/20">
                                        <img
                                            src={member.image || 'https://via.placeholder.com/300'}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            alt={member.name}
                                        />
                                    </div>
                                </div>

                                {/* Üye Bilgileri */}
                                <div className="text-center px-2">
                                    <h3 className="text-lg font-black dark:text-white tracking-tight leading-tight">
                                        {member.name}
                                    </h3>
                                    <p className="text-xs font-bold text-media-light uppercase tracking-widest mt-1 opacity-80">
                                        {member.role}
                                    </p>
                                </div>

                                {/* LinkedIn Butonu */}
                                <div className="mt-4">
                                    {member.linkedin ? (
                                        <motion.a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="w-10 h-10 rounded-xl bg-white dark:bg-dark-card flex items-center justify-center text-media-light hover:bg-media-light hover:text-white transition-all shadow-sm border border-slate-100 dark:border-white/5"
                                            title={`${member.name} LinkedIn Profili`}
                                        >
                                            <span className="font-bold text-[10px] tracking-tighter">IN</span>
                                        </motion.a>
                                    ) : (
                                        <div className="h-10 invisible">Boşluk</div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default Team;