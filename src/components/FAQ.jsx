import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 dark:border-white/10 last:border-0 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-media-light transition-colors">
                    {question}
                </span>
                <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
                    {isOpen ? '✕' : '+'}
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQ = () => {
    const questions = [
        { question: "Topluluğa nasıl üye olabilirim?", answer: "Sitemizdeki 'Kayıt Ol' butonuna tıklayarak formu doldurman yeterli. Ardından seni Discord kanalımıza davet edeceğiz!" },
        { question: "Üyelik için herhangi bir bölüm kısıtlaması var mı?", answer: "Hayır! Bandırma Onyedi Eylül Üniversitesi'ndeki tüm bölümlerden öğrenciler Media Action'a katılabilir." },
        { question: "Etkinlikleriniz ücretli mi?", answer: "Genellikle tüm etkinliklerimiz ücretsizdir. Bazı özel teknik gezilerde sadece yol masrafları paylaşımlı olabilir." },
        { question: "Okulun dışında etkinlik yapıyor musunuz?", answer: "Kesinlikle! Oyun geceleri, sosyal etkinlikler ve daha fazlası için aramıza katıl." }
    ];

    return (
        <section className="py-24 bg-white dark:bg-dark-bg transition-colors duration-500">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-4xl font-extrabold text-media-navy dark:text-white text-center mb-16 tracking-tight">Merak Edilenler</h2>
                <div className="bg-canvas/50 dark:bg-dark-card/30 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-antigravity">
                    {questions.map((q, i) => <FAQItem key={i} {...q} />)}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
