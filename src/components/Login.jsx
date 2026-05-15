import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "media123") { // Burayı kendi şifrenle değiştir
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin');
        } else {
            alert("Hatalı Şifre!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-canvas dark:bg-dark-bg px-6">
            <div className="bg-white dark:bg-dark-card p-10 rounded-[3rem] shadow-antigravity w-full max-w-md border border-slate-100 dark:border-white/5">
                <h2 className="text-3xl font-black text-media-navy dark:text-white mb-8 text-center">Yönetici Girişi</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <input
                        type="password"
                        placeholder="Şifreyi Giriniz"
                        className="w-full px-6 py-4 rounded-2xl bg-canvas dark:bg-dark-bg border border-slate-100 dark:border-white/10 outline-none focus:ring-2 focus:ring-media-light dark:text-white transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full py-4 bg-media-navy dark:bg-white text-white dark:text-media-navy rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                        Sisteme Gir
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;