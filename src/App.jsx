import React, { useState } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import { useTasks } from './hooks/useTasks';
import { HiPlus } from 'react-icons/hi';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Ambil data dan status loading
  const { tasks, isLoading } = useTasks();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) return <Login onLoginSuccess={(userData) => setUser(userData)} />;

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <Sidebar user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 h-screen overflow-y-auto p-8 relative">
        {/* LOADING OVERLAY: Memanfaatkan variabel isLoading */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-medium">Menyinkronkan data...</p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
            
            {activeTab === 'kanban' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
              >
                <HiPlus size={20} />
                Tambah Task
              </button>
            )}
          </header>

          {activeTab === 'dashboard' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 col-span-2">
                  <h3 className="text-xl font-bold mb-4">Ringkasan Tugas</h3>
                  <div className="text-6xl font-black text-blue-500 mb-2">{tasks.length}</div>
                  <p className="text-slate-400">Tugas aktif yang perlu kamu kelola hari ini.</p>
                </div>
             </div>
          )}

          {activeTab === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {['todo', 'in-progress', 'done'].map((status) => (
                <div key={status} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 min-h-[500px]">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 px-2 flex justify-between">
                    {status.replace('-', ' ')}
                    <span className="bg-slate-700 text-slate-300 px-2 rounded-full text-[10px]">
                      {tasks.filter(t => t.status === status).length}
                    </span>
                  </h3>
                  <div className="space-y-4">
                    {tasks.filter(t => t.status === status).map(task => (
                      <TaskCard key={task._id} task={task} />
                    ))}
                    {!isLoading && tasks.filter(t => t.status === status).length === 0 && (
                      <div className="text-center py-10 text-slate-600 text-xs border-2 border-dashed border-slate-800 rounded-xl">
                        Kosong
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'void' && (
            <div className="bg-slate-800 p-12 rounded-2xl border border-dashed border-slate-600 text-center">
              <p className="text-slate-500 italic">The Void is calling...</p>
            </div>
          )}
        </div>

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
}

export default App;