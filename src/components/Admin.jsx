import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// --- FIREBASE BAĞLANTISINI EKLEDİK ---
import { db } from '../firebase'; // Eğer firebase.js ile aynı klasördeyse './firebase' yapabilirsin
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// --- RESİM SIKIŞTIRMA MOTORU (Aynen Korundu) ---
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
                        width = Math.round((height * maxHeight) / height);
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
    const [activeTab, setActiveTab] = useState('events');
    const [events, setEvents] = useState([]);
    const [team, setTeam] = useState([]);
    const [apps, setApps] = useState([]);

    // Düzenleme modları (Firestore ID'leri string olduğu için null veya string tutacak)
    const [editingEventId, setEditingEventId] = useState(null);
    const [editingMemberId, setEditingMemberId] = useState(null);

    const navigate = useNavigate();

    // Form Taslakları
    const emptyEvent = { title: '', date: '', desc: '', status: 'Yaklaşan', icon: '🎙️', tag: 'Konferans', formUrl: '', images: [] };
    const emptyMember = { name: '', role: '', linkedin: '', image: '' };

    const [newEvent, setNewEvent] = useState(emptyEvent);
    const [newMember, setNewMember] = useState(emptyMember);

    // --- BULUTTAN VERİLERİ ÇEKEN FONKSİYONLAR ---
    const fetchFirebaseData = async () => {
        try {
            // 1. Etkinlikleri Tarihe Göre Sıralı Çek
            const eventsQuery = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
            const eventsSnapshot = await getDocs(eventsQuery);
            const eventsList = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventsList);

            // 2. Ekip Üyelerini Çek
            const teamSnapshot = await getDocs(collection(db, 'team'));
            const teamList = teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeam(teamList);

            // 3. Başvuruları Çek
            const appsSnapshot = await getDocs(collection(db, 'applications'));
            const appsList = appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApps(appsList);
        } catch (error) {
            console.error("Veriler buluttan yüklenirken hata oluştu:", error);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') navigate('/login');
        fetchFirebaseData(); // Sayfa açılınca verileri Firebase'den çekiyoruz
    }, [navigate]);

    // --- FOTOĞRAF YÜKLEME VE SIKIŞTIRMA (Aynen Korundu) ---
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

    // --- ETKİNLİK YÖNETİMİ (YENİ ASENKRON FİREBASE YAPISI) ---
    const saveEvent = async (e) => {
        e.preventDefault();
        try {
            if (editingEventId) {
                // Güncelleme Modu
                const eventDocRef = doc(db, 'events', editingEventId);
                await updateDoc(eventDocRef, newEvent);
                setEditingEventId(null);
            } else {
                // Yeni Ekleme Modu (Oluşturulma tarihini otomatik ekliyoruz)
                await addDoc(collection(db, 'events'), {
                    ...newEvent,
                    createdAt: Date.now()
                });
            }
            setNewEvent(emptyEvent);
            fetchFirebaseData(); // Listeyi güncelle
            alert("Etkinlik başarıyla buluta kaydedildi!");
        } catch (error) {
            alert("Etkinlik kaydedilirken bir hata oluştu.");
            console.error(error);
        }
    };

    const deleteEvent = async (id) => {
        if (window.confirm("Bu etkinliği silmek istediğine emin misin?")) {
            try {
                await deleteDoc(doc(db, 'events', id));
                fetchFirebaseData(); // Listeyi güncelle
            } catch (error) {
                console.error("Silme hatası:", error);
            }
        }
    };

    // --- EKİP YÖNETİMİ (YENİ ASENKRON FİREBASE YAPISI) ---
    const saveMember = async (e) => {
        e.preventDefault();
        try {
            if (editingMemberId) {
                // Güncelleme Modu
                const memberDocRef = doc(db, 'team', editingMemberId);
                await updateDoc(memberDocRef, newMember);
                setEditingMemberId(null);
            } else {
                // Yeni Ekleme Modu
                await addDoc(collection(db, 'team'), {
                    ...newMember,
                    createdAt: Date.now()
                });
            }
            setNewMember(emptyMember);
            fetchFirebaseData(); // Listeyi güncelle
            alert("Ekip üyesi başarıyla buluta kaydedildi!");
        } catch (error) {
            alert("Üye kaydedilirken hata oluştu.");
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

    // --- BAŞVURU SİLME ---
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
                    <button onClick={() => setActiveTab('events')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'events' ? 'bg-white dark:bg-slate-800 shadow-sm text-media-light' : 'text-slate-400'}`}>Etkinlikler</button>
                    <button onClick={() => setActiveTab('team')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'team' ? 'bg-white dark:bg-slate-800 shadow-sm text-media-light' : 'text-slate-400'}`}>Ekibimiz</button>
                    <button onClick={() => setActiveTab('apps')} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'apps' ? 'bg-white dark:bg-slate-800 shadow-sm text-media-light' : 'text-slate-400'}`}>Başvurular ({apps.length})</button>
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

            {/* --- EKİP SEKMESİ --- */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {team.map(member => (
                            <div key={member.id} className="flex justify-between items-center p-6 bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-100 dark:border-white/5 transition-colors shadow-sm">
                                <div className="flex items-center gap-6">
                                    <img src={member.image || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-full object-cover border-2 border-media-light/10 transition-colors" />
                                    <div><h4 className="font-bold text-lg dark:text-white leading-tight transition-colors">{member.name}</h4><p className="text-sm font-bold text-media-light uppercase transition-colors">{member.role}</p></div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setNewMember(member); setEditingMemberId(member.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-5 py-2 bg-blue-50 text-blue-500 rounded-xl font-bold text-xs hover:bg-blue-500 hover:text-white transition-all">Düzenle</button>
                                    <button onClick={() => deleteMember(member.id)} className="px-5 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all">Sil</button>
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