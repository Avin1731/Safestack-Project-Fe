import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';

const Login = ({ onLoginSuccess }) => {
  const handleSuccess = async (response) => {
    try {
      const idToken = response.credential;
      
      // Kirim idToken ke Backend
      const res = await api.post('/auth/google', { idToken });
      
      // Simpan credentials
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Panggil fungsi callback dari App.jsx untuk update state secara reaktif
      onLoginSuccess(res.data.user);
      
      console.log("Login Sukses: Handshake Berhasil");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Koneksi ke server gagal. Pastikan Backend menyala.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-700 text-center space-y-8">
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
            SafeTask
          </h1>
          <p className="text-slate-400 text-sm px-4">
            Kelola tugas dengan Kanban dan tuangkan perasaanmu di The Void secara anonim.
          </p>
        </div>

        <div className="flex justify-center py-4 scale-110">
          <GoogleLogin 
            onSuccess={handleSuccess} 
            onError={() => console.log('Login Gagal')}
            useOneTap
            theme="filled_blue"
            shape="circle"
          />
        </div>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Encrypted & Anonymous Environment
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;