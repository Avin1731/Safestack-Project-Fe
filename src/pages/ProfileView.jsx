import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion'; 
import { HiCheck, HiPhotograph, HiChat, HiClipboardCheck, HiClipboardList } from 'react-icons/hi';
import api from '../api/axios';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon, colorClass }) => (
  <div className="p-6 rounded-3xl border flex flex-col items-center justify-center gap-2 text-center transition-colors
    bg-white/50 border-olive/10 
    dark:bg-dark-card dark:border-dark-border">
    <div className={`p-3 rounded-full text-white ${colorClass}`}>
      {icon}
    </div>
    <h3 className="text-3xl font-black text-forest dark:text-dark-text">{value}</h3>
    <p className="text-xs font-bold uppercase tracking-widest text-olive/60 dark:text-dark-sub">{label}</p>
  </div>
);

const ProfileView = ({ user, onUpdateUser, stats }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    photoUrl: '',
    quote: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        photoUrl: user.photoUrl || '',
        quote: user.quote || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.displayName.trim()) return toast.error("Nama tidak boleh kosong");
    
    setIsLoading(true);
    try {
      const res = await api.put('/auth/profile', formData);
      onUpdateUser(res.data.user);
      toast.success("Profil berhasil diupdate!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal update profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Profile */}
      <div className="text-center space-y-4">
        <div className="relative w-32 h-32 mx-auto">
            <div className="w-full h-full rounded-full border-4 shadow-2xl overflow-hidden flex items-center justify-center
              border-cream bg-olive 
              dark:border-dark-border dark:bg-dark-card">
                {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                ) : (
                    <span className="text-5xl font-black text-cream dark:text-dark-text">{formData.displayName?.charAt(0)}</span>
                )}
            </div>
        </div>
        <div>
            <h1 className="text-3xl font-black tracking-tight text-forest dark:text-dark-text">{formData.displayName}</h1>
            <p className="text-sm font-medium italic mt-1 text-olive dark:text-dark-sub">"{formData.quote || 'No quote yet.'}"</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
            label="On Progress" 
            value={stats.inProgress} 
            icon={<HiClipboardList size={24} />} 
            colorClass="bg-earth" 
        />
        <StatCard 
            label="Selesai" 
            value={stats.completed} 
            icon={<HiClipboardCheck size={24} />} 
            colorClass="bg-olive" 
        />
        <StatCard 
            label="Curhatan" 
            value={stats.vents} 
            icon={<HiChat size={24} />} 
            colorClass="bg-sand" 
        />
      </div>

      {/* Edit Form dengan Motion.div */}
      <Motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-sm border p-8 rounded-[2.5rem]
          bg-white/60 border-olive/10
          dark:bg-dark-card dark:border-dark-border"
      >
        <h2 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-forest dark:text-dark-text">
            <HiPhotograph className="text-earth dark:text-blue-500" /> Edit Profile
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-olive dark:text-dark-sub">Nama Tampilan</label>
                <input 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border-transparent transition-all outline-none font-bold 
                      bg-cream focus:border-olive focus:bg-white text-forest
                      dark:bg-dark-bg dark:focus:border-blue-500 dark:text-dark-text"
                    placeholder="Nama kamu..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-olive dark:text-dark-sub">URL Foto Profil</label>
                <input 
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border-transparent transition-all outline-none font-medium
                      bg-cream focus:border-olive focus:bg-white text-forest
                      dark:bg-dark-bg dark:focus:border-blue-500 dark:text-dark-text"
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-olive dark:text-dark-sub">Quote / Bio</label>
                <textarea 
                    value={formData.quote}
                    onChange={(e) => setFormData({...formData, quote: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl border-transparent transition-all outline-none font-medium h-24 resize-none
                      bg-cream focus:border-olive focus:bg-white text-forest
                      dark:bg-dark-bg dark:focus:border-blue-500 dark:text-dark-text"
                    placeholder="Tulis kata-kata mutiaramu..."
                />
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1
                  bg-olive text-white hover:bg-forest
                  dark:bg-blue-600 dark:hover:bg-blue-700"
            >
                {isLoading ? "Menyimpan..." : <><HiCheck size={20} /> Simpan Perubahan</>}
            </button>
        </form>
      </Motion.div>
    </div>
  );
};

export default ProfileView;