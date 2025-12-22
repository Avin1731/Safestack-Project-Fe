import React, { useState } from 'react';
import Login from './pages/Login';

function App() {
  // Lazy State Initialization: Membaca localStorage hanya sekali saat pertama kali render
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Jika belum login, tampilkan halaman Login dan kirim fungsi setUser sebagai props
  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold text-blue-400 tracking-tighter italic">SafeTask</h2>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user.displayName}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <img 
            src={user.photoUrl} 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
          />
          <button 
            onClick={handleLogout}
            className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-800 p-10 rounded-2xl border border-slate-700 text-center max-w-lg shadow-2xl">
          <div className="inline-block p-3 bg-blue-500/10 rounded-full mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Dashboard Ready</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Sistem autentikasi sudah stabil menggunakan <span className="text-blue-400 font-mono">Lazy Initialization</span>. 
            Data user sekarang tersinkronisasi tanpa error cascading renders.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status DB</p>
              <p className="text-green-400 text-sm">● Connected</p>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Auth Type</p>
              <p className="text-blue-400 text-sm">Google OAuth</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;