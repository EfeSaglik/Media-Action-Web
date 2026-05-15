import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png'; // Logonun yolu
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Scroll efekti: Sayfa kayınca navbar belirginleşir
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) setScrolled(true);
            else setScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mobil menü açıkken arka sayfanın kaymasını durdurur
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    const navLinks = [
        { name: 'Biz Kimiz?', path: '/' },
        { name: 'Etkinlikler', path: '/etkinlikler' },
        { name: 'Ekibimiz', path: '/yonetim-kurulu' },
        { name: 'Tüzük', path: '/tuzuk' }
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || isOpen ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* SOL: LOGO VE ÜNİVERSİTE İSMİ */}
                <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="relative z-50 flex items-center gap-3 md:gap-4 cursor-pointer group"
                >
                    {/* Logo Kutusu */}
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-105 transition-transform duration-300">
                        <img src={logo} alt="Media Action Logo" className="w-full h-full object-contain" />
                    </div>

                    {/* Yazı Grubu */}
                    <div className="flex flex-col justify-center font-sans tracking-tight">
                        <span className="text-[8px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-[0.12em] leading-none mb-1 md:mb-1.5 transition-colors">
                            Bandırma Onyedi Eylül Üniversitesi
                        </span>
                        <div className="flex items-center gap-1 leading-none font-black text-base md:text-xl transition-colors">
                            <span className="text-media-navy dark:text-media-light">MEDIA</span>
                            <span className="text-slate-800 dark:text-white">ACTION</span>
                        </div>
                    </div>
                </Link>

                {/* ORTA/SAĞ: DESKTOP MENÜ (Geniş Ekran) */}
                <div className="hidden md:flex items-center gap-8 font-bold text-slate-600 dark:text-slate-300 text-sm">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.path}
                            className={`hover:text-media-light transition-colors ${location.pathname === link.path ? 'text-media-light' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 ml-4">
                        <ThemeToggle />
                        <Link to="/login" className="px-5 py-2 bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-xs font-bold rounded-full hover:scale-105 transition-all shadow-lg">
                            Kayıt Ol
                        </Link>
                    </div>
                </div>

                {/* SAĞ: MOBİL KONTROLLER (Küçük Ekran) */}
                <div className="flex md:hidden items-center gap-4 relative z-50">
                    <ThemeToggle />

                    {/* Hamburger İkonu */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-10 h-10 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-xl flex flex-col justify-center items-center gap-[5px] border border-slate-200 dark:border-white/10"
                    >
                        <span className={`block w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                        <span className={`block w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                        <span className={`block w-5 h-[2px] bg-slate-800 dark:bg-white rounded-full transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                    </button>
                </div>

            </div>

            {/* MOBİL MENÜ OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="fixed inset-0 top-0 left-0 w-full h-screen bg-white/95 dark:bg-dark-bg/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-10">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`text-4xl font-black tracking-tighter transition-colors ${location.pathname === link.path ? 'text-media-light' : 'text-slate-800 dark:text-white'}`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-10"
                            >
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="px-10 py-4 bg-media-navy dark:bg-white text-white dark:text-black rounded-full font-bold text-lg shadow-2xl"
                                >
                                    Kayıt Ol / Giriş
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;