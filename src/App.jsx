import React, { useState } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content View */}
      <main className="flex-1 h-screen overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Konten */}
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-400">Selamat datang kembali, {user.displayName.split(' ')[0]}!</p>
            </div>
            <div className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </header>

          {/* Conditional Rendering Content */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 col-span-2">
                <h3 className="text-xl font-bold mb-2">Progres Tugas</h3>
                <p className="text-slate-400">Kamu punya 0 tugas aktif hari ini. Mulai tambahkan tugas di Kanban Board!</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-xl shadow-blue-900/20">
                <h3 className="text-xl font-bold mb-2">The Void</h3>
                <p className="text-blue-100 text-sm opacity-90 mb-4">Butuh tempat curhat? Lepaskan bebanmu secara anonim di sini.</p>
                <button 
                  onClick={() => setActiveTab('void')}
                  className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50"
                >
                  Buka Void
                </button>
              </div>
            </div>
          )}

          {activeTab === 'kanban' && (
            <div className="bg-slate-800 p-12 rounded-2xl border border-dashed border-slate-600 text-center">
              <p className="text-slate-500">Workspace Kanban sedang dibangun (Iterasi 4.2)...</p>
            </div>
          )}

          {activeTab === 'void' && (
            <div className="bg-slate-800 p-12 rounded-2xl border border-dashed border-slate-600 text-center">
              <p className="text-slate-500">Canvas The Void sedang dibangun (Iterasi 4.3)...</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;