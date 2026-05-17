import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.6) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

const Admin = () => {
    const [activeTab, useStateActive] = useState('events');
    const [activeTabState, setActiveTab] = [activeTab, useStateActive];
    const [events, setEvents] = useState([]);
    const [team, setTeam] = useState([]);
    const [apps, setApps] = useState([]);

    const [editingEventId, setEditingEventId] = useState(null);
    const [editingMemberId, setEditingMemberId] = useState(null);

    const navigate = useNavigate();

    const emptyEvent = { title: '', date: '', desc: '', status: 'Yaklaşan', icon: '🎙️', tag: 'Konferans', formUrl: '', images: [] };
    const emptyMember = { name: '', role: '', linkedin: '', image: '' };

    const [newEvent, setNewEvent] = useState(emptyEvent);
    const [newMember, setNewMember] = useState(emptyMember);

    const fetchFirebaseData = async () => {
        try {
            // 1. Etkinlikleri Çek
            const eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
            const eventsSnapshot = await getDocs(eventsQuery);
            const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsList);

            // 2. Ekip Üyelerini Çek ve 'order' alanına göre sırala (Yoksa 0 kabul et)
            const teamSnapshot = await getDocs(collection(db, 'team'));
            const teamList = teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setTeam(teamList);

            // 3. Başvuruları Çek
            const appsSnapshot = await getDocs(collection(db, 'applications'));
            const appsList = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApps(appsList);
        } catch (error) {
            console.error("Veriler yüklenirken hata:", error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') navigate('/login');
        fetchFirebaseData();
    }, [navigate]);

    const handleImageUpload = async (e, target) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            try {
                const compressedBase64 = await compressImage(file, 800, 800, 0.6);
                if (target === 'event') {
                    setNewEvent(prev => ({ ...prev, images: [...prev.images, compressedBase64] }));
                } else if (target === 'member') {
                    setNewMember(prev => ({ ...prev, image: compressedBase64 }));
                }
            } catch (error) {
                console.error("Resim sıkıştırılamadı:", error);
            }
        }
    };

    // --- SÜRÜKLE BIRAK SÜREÇLERİ ---
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Drop tetiklenmesi için zorunlu
    };

    const handleDrop = async (e, targetIndex) => {
        const sourceIndex = Number(e.dataTransfer.getData('text/plain'));
        if (sourceIndex === targetIndex) return;

        const reorderedTeam = [...team];
        const [removed] = reorderedTeam.splice(sourceIndex, 1);
        reorderedTeam.splice(targetIndex, 0, removed);

        // Arayüzün hızlı tepki vermesi için state'i hemen güncelliyoruz
        setTeam(reorderedTeam);

        // Firebase'de yeni sıra numaralarını (order) güncelle
        try {
            for (let i = 0; i < reorderedTeam.length; i++) {
                const member = reorderedTeam[i];
                const memberDocRef = doc(db, 'team', member.id);
                await updateDoc(memberDocRef, { order: i });
            }
            console.log("Yeni sıralama buluta işlendi!");
        } catch (error) {
            console.error("Sıralama güncellenirken hata oluştu:", error);
        }
    };

    // --- ETKİNLİK KAYDET ---
    const saveEvent = async (e) => {
        e.preventDefault();
        try {
            if (editingEventId) {
                const eventDocRef = doc(db, 'events', editingEventId);
                await updateDoc(eventDocRef, newEvent);
                setEditingEventId(null);
            } else {
                await addDoc(collection(db, 'events'), { ...newEvent, createdAt: Date.now() });
            }
            setNewEvent(emptyEvent);
            fetchFirebaseData();
            alert("Etkinlik kaydedildi!");
        } catch (error) {
            console.error(error);
        }
    };

    const deleteEvent = async (id) => {
        if (window.confirm("Bu etkinliği silmek istediğine emin misin?")) {
            try {
                await deleteDoc(doc(db, 'events', id));
                fetchFirebaseData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // --- EKİP KAYDET ---
    const saveMember = async (e) => {
        e.preventDefault();
        try {
            if (editingMemberId) {
                const memberDocRef = doc(db, 'team', editingMemberId);
                await updateDoc(memberDocRef, newMember);
                setEditingMemberId(null);
            } else {
                // Yeni eklenen kişiyi listenin en sonuna atmak için order: team.length veriyoruz
                await addDoc(collection(db, 'team'), {
                    ...newMember,
                    order: team.length,
                    createdAt: Date.now()
                });
            }
            setNewMember(emptyMember);
            fetchFirebaseData();
            alert("Ekip üyesi kaydedildi!");
        } catch (error) {
            console.error(error);
        }
    };

    const deleteMember = async (id) => {
        if (window.confirm("Bu üyeyi silmek istediğine emin misin?")) {
            try {
                await deleteDoc(doc(db, 'team', id));
                fetchFirebaseData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const deleteApp = async (id) => {
        if (window.confirm("Bu başvuruyu silmek istediğine emin misin?")) {
            try {
                await deleteDoc(doc(db, 'applications', id));
                fetchFirebaseData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/login');
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto min-h-screen">
            {/* Header ve Sekmeler */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <h2 className="text-4xl font-black dark:text-white tracking-tighter transition-colors">Yönetim Paneli</h2>
                <div className="flex bg-canvas dark:bg-dark-bg p-1.5 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                    <button onClick={() => useStateActive('events')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'events' ? 'bg-white dark:bg-slate-800 shadow-sm text-media-light' : 'text-slate-400'}`}>Etkinlikler</button>
                    <button onClick={() => useStateActive('team')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'team' ? 'bg-white dark:bg-slate-800 shadow-sm text-media-light' : 'text-slate-400'}`}>Ekibimiz</button>
                    <button onClick={() => useStateActive('apps')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'apps' ? 'bg-white dark:bg-slate-800 shadow-sm text-media-light' : 'text-slate-400'}`}>Başvurular ({apps.length})</button>
                </div>
                <button onClick={logout} className="px-6 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-all">Çıkış Yap</button>
            </div>

            {/* --- ETKİNLİK SEKMESİ --- */}
            {activeTab === 'events' && (
                <div className="animate-fadeIn">
                    <form onSubmit={saveEvent} className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] shadow-sm grid md:grid-cols-2 gap-6 border border-slate-100 dark:border-white/5 mb-16 transition-colors">
                        <h3 className="md:col-span-2 text-xl font-bold dark:text-white mb-2">{editingEventId ? "Etkinliği Düzenle" : "Yeni Etkinlik Ekle"}</h3>
                        <input type="text" placeholder="Etkinlik Adı" className="admin-input" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
                        <input type="text" placeholder="Tarih" className="admin-input" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                        <select className="admin-input" value={newEvent.status} onChange={e => setNewEvent({ ...newEvent, status: e.target.value })}>
                            <option>Yaklaşan</option><option>Kayıt Açık</option><option>Tamamlandı</option>
                        </select>
                        <input type="text" placeholder="İkon (Emoji)" className="admin-input" value={newEvent.icon} onChange={e => setNewEvent({ ...newEvent, icon: e.target.value })} />
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2">Görseller</label>
                            <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e, 'event')} className="admin-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-media-light/10 file:text-media-light" />
                        </div>
                        <textarea placeholder="Açıklama" className="admin-input md:col-span-2" value={newEvent.desc} onChange={e => setNewEvent({ ...newEvent, desc: e.target.value })}></textarea>
                        <input type="text" placeholder="Google Form URL" className="admin-input md:col-span-2" value={newEvent.formUrl} onChange={e => setNewEvent({ ...newEvent, formUrl: e.target.value })} />
                        <button className={`md:col-span-2 py-5 text-white rounded-[1.5rem] font-bold shadow-xl transition-all ${editingEventId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-media-light hover:bg-media-navy'}`}>{editingEventId ? "Değişiklikleri Kaydet" : "Etkinliği Yayınla"}</button>
                    </form>

                    <div className="space-y-4">
                        {events.map(ev => (
                            <div key={ev.id} className="flex justify-between items-center p-6 bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-white/5 transition-colors shadow-sm">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-canvas flex items-center justify-center text-2xl transition-colors">{ev.images && ev.images[0] ? <img src={ev.images[0]} className="w-full h-full object-cover" /> : ev.icon}</div>
                                    <div><h4 className="font-bold text-lg dark:text-white leading-tight transition-colors">{ev.title}</h4><p className="text-sm text-slate-400">{ev.date}</p></div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setNewEvent(ev); setEditingEventId(ev.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-5 py-2 bg-blue-50 text-blue-500 rounded-xl font-bold text-xs hover:bg-blue-500 hover:text-white transition-all">Düzenle</button>
                                    <button onClick={() => deleteEvent(ev.id)} className="px-5 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all">Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- EKİP SEKMESİ (SÜRÜKLENEBİLİR YAPILDI) --- */}
            {activeTab === 'team' && (
                <div className="animate-fadeIn">
                    <form onSubmit={saveMember} className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] shadow-sm grid md:grid-cols-2 gap-6 border border-slate-100 dark:border-white/5 mb-16 transition-colors">
                        <h3 className="md:col-span-2 text-xl font-bold dark:text-white mb-2">{editingMemberId ? "Üyeyi Düzenle" : "Yeni Üye Ekle"}</h3>
                        <input type="text" placeholder="Ad Soyad" className="admin-input" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} required />
                        <input type="text" placeholder="Ünvan (Örn: Başkan)" className="admin-input" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} required />
                        <input type="url" placeholder="LinkedIn URL (https://...)" className="admin-input md:col-span-2" value={newMember.linkedin} onChange={e => setNewMember({ ...newMember, linkedin: e.target.value })} />
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2">Profil Fotoğrafı</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'member')} className="admin-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-media-light/10 file:text-media-light cursor-pointer" />
                        </div>
                        <button className={`md:col-span-2 py-5 text-white rounded-[1.5rem] font-bold shadow-xl transition-all ${editingMemberId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-media-navy hover:opacity-90'}`}>{editingMemberId ? "Bilgileri Güncelle" : "Üyeyi Ekle"}</button>
                    </form>

                    <p className="text-xs font-bold text-slate-400 mb-4 px-2 uppercase tracking-wider">💡 İpucu: Üyeleri sıralamak için kartları tutup aşağı/yukarı sürükleyebilirsiniz.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {team.map((member, index) => (
                            <div
                                key={member.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                className="cursor-move active:scale-95 flex justify-between items-center p-6 bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-white/5 transition-all shadow-sm hover:border-media-light/30 select-none"
                            >
                                <div className="flex items-center gap-6 pointer-events-none">
                                    <img src={member.image || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-full object-cover border-2 border-media-light/10" />
                                    <div>
                                        <h4 className="font-bold text-lg dark:text-white leading-tight">{member.name}</h4>
                                        <p className="text-sm font-bold text-media-light uppercase mt-0.5">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); setNewMember(member); setEditingMemberId(member.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-5 py-2 bg-blue-50 text-blue-500 rounded-xl font-bold text-xs hover:bg-blue-500 hover:text-white transition-all">Düzenle</button>
                                    <button onClick={(e) => { e.stopPropagation(); deleteMember(member.id); }} className="px-5 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all">Sil</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- BAŞVURU SEKMESİ --- */}
            {activeTab === 'apps' && (
                <div className="space-y-6 animate-fadeIn">
                    {apps.length === 0 ? <p className="text-slate-400 italic px-2">Henüz başvuru yok.</p> :
                        apps.map(app => (
                            <div key={app.id} className="bg-white dark:bg-dark-card p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm transition-colors">
                                <div className="flex justify-between mb-4">
                                    <h4 className="text-2xl font-black dark:text-white transition-colors">{app.name} <span className="text-sm font-normal text-slate-400">({app.email})</span></h4>
                                    <button onClick={() => deleteApp(app.id)} className="text-red-500 font-bold text-sm hover:underline">Sil</button>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed transition-colors">"{app.message}"</p>
                                <p className="text-right text-[10px] text-slate-300 mt-4 font-bold">{app.date}</p>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default Admin;