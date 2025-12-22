import React, { useState } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import KanbanColumn from './components/KanbanColumn';
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

  const { tasks, isLoading, updateTask } = useTasks();

  // Setup Sensors untuk Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // ID kolom tujuan

    // Cari task yang sedang di-drag
    const task = tasks.find(t => t._id === taskId);
    
    // Jika statusnya berubah, update ke Backend
    if (task && task.status !== newStatus && ['todo', 'in-progress', 'done'].includes(newStatus)) {
      updateTask({ id: taskId, status: newStatus });
    }
  };

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
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold capitalize">{activeTab}</h2>
            {activeTab === 'kanban' && (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                <HiPlus size={20} /> Tambah Task
              </button>
            )}
          </header>

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 col-span-2">
                <h3 className="text-xl font-bold mb-4">Ringkasan Tugas</h3>
                <div className="text-6xl font-black text-blue-500 mb-2">{tasks.length}</div>
                <p className="text-slate-400 text-sm">Tugas aktif yang perlu diselesaikan.</p>
              </div>
            </div>
          )}

          {activeTab === 'kanban' && (
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCorners} 
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {['todo', 'in-progress', 'done'].map((status) => (
                  <KanbanColumn 
                    key={status} 
                    status={status} 
                    tasks={tasks.filter(t => t.status === status)} 
                  />
                ))}
              </div>
            </DndContext>
          )}

          {activeTab === 'void' && (
            <div className="bg-slate-800 p-12 rounded-2xl border border-dashed border-slate-600 text-center text-slate-500">
              The Void is coming soon...
            </div>
          )}
        </div>

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </main>
    </div>
  );
}

export default App;