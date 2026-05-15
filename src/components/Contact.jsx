import React from 'react';

const Contact = () => {
    return (
        <section id="iletisim" className="py-24 bg-canvas dark:bg-dark-bg transition-colors duration-500">
            <div className="max-w-5xl mx-auto px-6">
                <div className="bg-white dark:bg-dark-card rounded-[4rem] p-10 md:p-20 shadow-antigravity dark:shadow-none border border-slate-50 dark:border-white/5 grid md:grid-cols-2 gap-16 items-center">

                    <div>
                        <h2 className="text-5xl font-extrabold text-media-navy dark:text-white mb-6 tracking-tighter">Bize Katıl.</h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                            Medyanın geleceğini bizimle birlikte keşfetmek ister misin? Formu doldur, ekibimiz seninle iletişime geçsin.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-media-light font-bold">
                                <span>📧</span> banumediaaction@gmail.com
                            </div>
                            <div className="flex items-center gap-4 text-media-navy dark:text-slate-300 font-bold">
                                <span>📍</span> BANÜ Merkez Kampüs
                            </div>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <input
                            type="text"
                            placeholder="Adın Soyadın"
                            className="w-full px-6 py-4 rounded-2xl bg-canvas dark:bg-dark-bg border border-slate-100 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-media-light transition-all dark:text-white"
                        />
                        <input
                            type="email"
                            placeholder="Email Adresin"
                            className="w-full px-6 py-4 rounded-2xl bg-canvas dark:bg-dark-bg border border-slate-100 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-media-light transition-all dark:text-white"
                        />
                        <textarea
                            rows="4"
                            placeholder="Neden bize katılmak istiyorsun?"
                            className="w-full px-6 py-4 rounded-2xl bg-canvas dark:bg-dark-bg border border-slate-100 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-media-light transition-all dark:text-white resize-none"
                        ></textarea>
                        <button className="w-full py-4 bg-[#1d1d1f] dark:bg-white text-white dark:text-dark-bg rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                            Başvurunu Gönder
                        </button>
                    </form>

                </div>
            </div>
        </section>
    );
};

export default Contact;