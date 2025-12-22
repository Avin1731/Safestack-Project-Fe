import React, { useState } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard'; // Import ini
import { useTasks } from './hooks/useTasks'; // Import ini

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Panggil Data Tasks
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

      <main className="flex-1 h-screen overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
          </header>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 col-span-2">
                <h3 className="text-xl font-bold mb-4">Ringkasan Tugas</h3>
                <div className="text-4xl font-black text-blue-500">{tasks.length}</div>
                <p className="text-slate-400 text-sm">Total tugas yang kamu miliki.</p>
              </div>
            </div>
          )}

          {activeTab === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {['todo', 'in-progress', 'done'].map((status) => (
                <div key={status} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4 px-2 flex justify-between">
                    {status.replace('-', ' ')}
                    <span className="bg-slate-700 text-slate-300 px-2 rounded-full text-[10px]">
                      {tasks.filter(t => t.status === status).length}
                    </span>
                  </h3>
                  
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="p-4 text-center text-slate-600 text-xs animate-pulse">Memuat...</div>
                    ) : (
                      tasks
                        .filter(t => t.status === status)
                        .map(task => <TaskCard key={task._id} task={task} />)
                    )}
                    
                    {tasks.filter(t => t.status === status).length === 0 && !isLoading && (
                      <div className="border-2 border-dashed border-slate-800 p-8 rounded-xl text-center text-slate-600 text-xs">
                        Belum ada tugas
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'void' && (
            <div className="bg-slate-800 p-12 rounded-2xl border border-dashed border-slate-600 text-center">
              <p className="text-slate-500">The Void is coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;