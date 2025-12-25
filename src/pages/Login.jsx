import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';

const Login = ({ onLoginSuccess }) => {
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
    <div className="min-h-screen bg-[#FEFAE0] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#CCD5AE]/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#E0E5B6]/40 rounded-full blur-3xl" />

      <div className="max-w-md w-full bg-[#FAEDCE]/80 backdrop-blur-xl p-12 rounded-[4rem] border border-[#E0E5B6] text-center space-y-10 shadow-[0_32px_64px_-16px_rgba(40,54,24,0.1)] relative z-10">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-[#606C38] rounded-3xl mx-auto flex items-center justify-center shadow-lg rotate-3">
             <span className="text-3xl font-black text-[#FEFAE0]">SS</span>
          </div>
          <h1 className="text-5xl font-black text-[#283618] tracking-tighter">
            SafeStack
          </h1>
          <p className="text-[#606C38]/70 text-sm font-bold px-4 leading-relaxed uppercase tracking-wider">
            Your Productivity Sanctuary
          </p>
        </div>

        <div className="flex justify-center py-4 scale-125">
          <GoogleLogin 
            onSuccess={handleSuccess} 
            onError={() => console.log('Login Gagal')}
            theme="filled_blue"
            shape="pill"
          />
        </div>

        <div className="pt-8 border-t border-[#E0E5B6]">
          <p className="text-[10px] text-[#606C38]/50 uppercase tracking-[0.3em] font-black">
            Encrypted & Private Environment
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;