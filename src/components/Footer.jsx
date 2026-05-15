import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-dark-bg pt-20 pb-10 px-6 border-t border-slate-100 dark:border-white/5 transition-colors duration-500">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 mb-16">

        {/* Marka */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-baseline gap-1 group">
            <span className="text-media-navy dark:text-media-light font-extrabold text-3xl tracking-tighter transition-colors">MEDIA</span>
            <span className="text-slate-900 dark:text-white font-bold text-xl tracking-widest transition-colors">ACTION</span>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mt-2 transition-colors">
            Bandırma Onyedi Eylül Üniversitesi'nin en dinamik dijital iletişim ve medya öğrenci topluluğu.
          </p>
        </div>

        {/* Keşfet (Geçmiş Projeler Kaldırıldı) */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-lg transition-colors">Keşfet</h4>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400 font-medium transition-colors">
            <li>
              <Link to="/tuzuk" className="hover:text-media-light hover:translate-x-1 transition-all inline-block">Topluluk Tüzüğü</Link>
            </li>
            <li>
              <Link to="/etkinlikler" className="hover:text-media-light hover:translate-x-1 transition-all inline-block">Yaklaşan Etkinlikler</Link>
            </li>
            <li>
              <Link to="/yonetim-kurulu" className="hover:text-media-light hover:translate-x-1 transition-all inline-block">Yönetim Kurulu</Link>
            </li>
          </ul>
        </div>

        {/* İletişim */}
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-lg transition-colors">Bize Ulaşın</h4>
          <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium transition-colors">BANÜ Merkez Kampüs</p>
          <a href="mailto:banumediaaction@gmail.com" className="text-media-light dark:text-blue-400 hover:text-media-navy dark:hover:text-white transition-colors mb-6 inline-block font-medium">
            banumediaaction@gmail.com
          </a>

          <div className="flex gap-4">
            <a href="https://www.instagram.com/banumediaaction/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-canvas dark:bg-dark-card flex items-center justify-center text-media-navy dark:text-media-light hover:bg-media-light hover:text-white hover:-translate-y-1 transition-all shadow-sm border border-transparent dark:border-white/5 font-bold">IG</a>
            <div className="w-12 h-12 rounded-2xl bg-canvas dark:bg-dark-card flex items-center justify-center text-media-navy dark:text-media-light hover:bg-media-light hover:text-white hover:-translate-y-1 transition-all shadow-sm border border-transparent dark:border-white/5 font-bold">IN</div>
            <div className="w-12 h-12 rounded-2xl bg-canvas dark:bg-dark-card flex items-center justify-center text-media-navy dark:text-media-light hover:bg-media-light hover:text-white hover:-translate-y-1 transition-all shadow-sm border border-transparent dark:border-white/5 font-bold">YT</div>
          </div>
        </div>

      </div>

      <div className="text-center text-slate-400 dark:text-slate-600 text-sm font-medium border-t border-slate-100 dark:border-white/5 pt-8 transition-colors">
        © {new Date().getFullYear()} Media Action Topluluğu. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;