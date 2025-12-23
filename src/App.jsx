import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCorners, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// Komponen
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import KanbanColumn from './components/KanbanColumn';
import VentNote from './components/VentNote';
import AddTaskModal from './components/AddTaskModal';
import AddVentModal from './components/AddVentModal';
import Login from './pages/Login';

// Hooks
import { useTasks } from './hooks/useTasks';
import { useVents } from './hooks/useVents';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isVentModalOpen, setIsVentModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const { tasks, isLoading: tLoading, updateTask } = useTasks();
  const { vents, isLoading: vLoading } = useVents();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      updateTask({ id: active.id, status: over.id });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (!user) return <Login onLoginSuccess={setUser} />;

  return (
    <div className="flex h-screen bg-[#FEFAE0] text-[#283618] font-sans overflow-hidden">
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative">
        <Header 
          activeTab={activeTab} 
          onToggleSidebar={() => setIsSidebarOpen(true)} 
          onAddTask={() => setIsTaskModalOpen(true)}
          onAddVent={() => setIsVentModalOpen(true)}
          isLoading={tLoading || vLoading}
        />

        <main className="flex-1 p-10 overflow-y-auto bg-[#FEFAE0] scrollbar-hide">
          <AnimatePresence mode="wait">
            <Motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }} 
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl">
                  <div className="bg-[#FAEDCE] p-12 rounded-[3rem] border border-[#E0E5B6] shadow-sm">
                    <h3 className="font-bold text-[#606C38] mb-4 uppercase tracking-[0.2em] text-[10px]">Tugas Aktif</h3>
                    <div className="text-9xl font-black text-[#606C38] leading-none tracking-tighter">{tasks?.length || 0}</div>
                  </div>
                  <div className="bg-[#CCD5AE] p-12 rounded-[3rem] flex flex-col justify-between shadow-lg">
                    <div>
                      <h3 className="font-bold text-[#606C38] uppercase tracking-[0.2em] text-[10px] mb-2">Pesan Void</h3>
                      <p className="opacity-80 italic font-medium text-lg">Ada {vents?.length || 0} curhatan mengambang.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('void')} 
                      className="mt-8 bg-[#FEFAE0] text-[#606C38] px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-sm w-fit hover:scale-105 transition-all"
                    >
                      Buka Void
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'kanban' && (
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-3 gap-8 h-full items-start">
                    {['todo', 'in-progress', 'done'].map(s => (
                      <KanbanColumn key={s} status={s} tasks={tasks.filter(t => t.status === s)} />
                    ))}
                  </div>
                </DndContext>
              )}

              {activeTab === 'void' && (
                <div className="relative w-full h-[75vh] bg-white/30 rounded-[4rem] border-2 border-dashed border-[#CCD5AE] overflow-hidden shadow-inner backdrop-blur-sm">
                  {vents.map(v => <VentNote key={v._id} vent={v} />)}
                </div>
              )}
            </Motion.div>
          </AnimatePresence>
        </main>

        <Footer user={user} />
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        user={user} setUser={setUser}
        onLogout={handleLogout}
      />

      <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <AddVentModal isOpen={isVentModalOpen} onClose={() => setIsVentModalOpen(false)} />
    </div>
  );
}

export default App;