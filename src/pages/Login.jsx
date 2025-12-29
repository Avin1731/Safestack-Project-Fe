import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { HiMoon, HiSun } from 'react-icons/hi'; // Import Icon
import { useTheme } from '../context/ThemeContext'; // Import Hook Tema
import api from '../api/axios';

const Login = ({ onLoginSuccess }) => {
  const { isDarkMode, toggleTheme } = useTheme(); // Gunakan Hook

  const handleSuccess = async (response) => {
    try {
      const idToken = response.credential;
      const res = await api.post('/auth/google', { idToken });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Koneksi ke server gagal. Pastikan Backend menyala.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500
      bg-cream dark:bg-dark-bg">
      
      {/* TRIGGER THEME (Pojok Kanan Atas) */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl shadow-lg hover:scale-110 transition-all border
            bg-pale text-olive border-sage hover:bg-cream
            dark:bg-dark-card dark:text-yellow-400 dark:border-dark-border dark:hover:bg-slate-800"
        >
          {isDarkMode ? <HiSun size={24} /> : <HiMoon size={24} />}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full blur-3xl bg-sage/30 dark:bg-blue-900/20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full blur-3xl bg-sage/40 dark:bg-purple-900/20" />

      <div className="max-w-md w-full p-12 rounded-[4rem] border text-center space-y-10 shadow-2xl relative z-10 backdrop-blur-xl transition-colors duration-500
        bg-pale/80 border-sage shadow-forest/5
        dark:bg-dark-card/80 dark:border-dark-border dark:shadow-black/50">
        
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg rotate-3 transition-colors
            bg-olive dark:bg-blue-600">
             <span className="text-3xl font-black text-cream">SS</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-forest dark:text-dark-text">
            SafeStack
          </h1>
          <p className="text-sm font-bold px-4 leading-relaxed uppercase tracking-wider text-olive/70 dark:text-dark-sub">
            Your Productivity Sanctuary
          </p>
        </div>

        <div className="flex justify-center py-4 scale-125">
          <GoogleLogin 
            onSuccess={handleSuccess} 
            onError={() => console.log('Login Gagal')}
            theme={isDarkMode ? "filled_black" : "filled_blue"} // Tema tombol Google ikut menyesuaikan
            shape="pill"
          />
        </div>

        <div className="pt-8 border-t border-sage dark:border-dark-border">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-olive/50 dark:text-dark-sub/50">
            Encrypted & Private Environment
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;