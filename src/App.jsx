import React, { useState } from 'react';
// Alias 'Motion' untuk menghindari error ESLint unused vars
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { HiPlus } from 'react-icons/hi';

// Components & Pages
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import KanbanColumn from './components/KanbanColumn';
import VentNote from './components/VentNote';
import AddTaskModal from './components/AddTaskModal';
import AddVentModal from './components/AddVentModal';

// Hooks
import { useTasks } from './hooks/useTasks';
import { useVents } from './hooks/useVents';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVentModalOpen, setIsVentModalOpen] = useState(false);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const { tasks, isLoading: tasksLoading, updateTask } = useTasks();
  const { vents, isLoading: ventsLoading } = useVents();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; 

    const task = tasks.find(t => t._id === taskId);
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
    <div className="flex min-h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="flex-1 h-screen relative overflow-hidden flex flex-col">
        {/* Loading Overlay Menggunakan Motion */}
        <AnimatePresence>
          {(tasksLoading || ventsLoading) && (
            <Motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-blue-400 animate-pulse">Syncing Workspace...</p>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>

        <header className="p-8 flex justify-between items-center z-10">
          <Motion.div 
            key={`header-${activeTab}`}
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-4xl font-black capitalize tracking-tight text-white">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-slate-500 text-sm font-medium">SafeTask / Project Workspace</p>
          </Motion.div>
          
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {activeTab === 'kanban' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg"
              >
                <HiPlus size={20} /> New Task
              </button>
            )}
            {activeTab === 'void' && (
              <button 
                onClick={() => setIsVentModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full font-black shadow-lg uppercase tracking-widest text-xs"
              >
                Post to Void
              </button>
            )}
          </Motion.div>
        </header>

        <div className="flex-1 p-8 pt-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <Motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">
                  <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 col-span-2">
                    <h3 className="text-xl font-bold mb-6 text-slate-300">Quick Stats</h3>
                    <div className="flex items-end gap-4">
                      <span className="text-8xl font-black text-blue-500 leading-none">{tasks.length}</span>
                      <div className="mb-2">
                        <p className="text-slate-400 font-bold text-lg uppercase">Tasks</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-3xl shadow-2xl flex flex-col justify-between">
                    <h3 className="text-xl font-bold mb-2">Community Void</h3>
                    <button 
                      onClick={() => setActiveTab('void')} 
                      className="w-full bg-white/10 py-2 rounded-xl text-sm font-bold border border-white/20"
                    >
                      Buka Void
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'kanban' && (
                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCorners} 
                  onDragEnd={handleDragEnd}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start overflow-y-auto pb-20 pr-2">
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
                <div className="relative w-full h-[75vh] bg-slate-950/40 rounded-[2.5rem] border border-slate-800/50 overflow-hidden shadow-inner">
                  {vents.map(vent => (
                    <VentNote key={vent._id} vent={vent} />
                  ))}
                  {vents.length === 0 && (
                    <div className="flex items-center justify-center h-full text-slate-600 font-mono italic text-sm">
                      Void sedang sunyi...
                    </div>
                  )}
                </div>
              )}
            </Motion.div>
          </AnimatePresence>
        </div>

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <AddVentModal isOpen={isVentModalOpen} onClose={() => setIsVentModalOpen(false)} />
      </main>
    </div>
  );
}

export default App;