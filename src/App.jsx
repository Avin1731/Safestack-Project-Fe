import React, { useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import KanbanView from './pages/KanbanView';
import VoidView from './pages/VoidView';

import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import AddVentModal from './components/AddVentModal';
import AddProjectModal from './components/AddProjectModal';

import { useTasks } from './hooks/useTasks';
import { useVents } from './hooks/useVents';
import { useProjects } from './hooks/useProjects';

function App() {
  // --- 1. STATES & AUTH ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return (savedUser && token) ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isVentModalOpen, setIsVentModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // --- 2. DATA FETCHING ---
  const { projects, isLoading: pLoading } = useProjects();
  const { vents, isLoading: vLoading } = useVents();
  
  // Dashboard Logic: Accumulate all projects but EXCLUDE status 'done'
  const { tasks: allTasks } = useTasks(null);
  const activeTasksCount = allTasks?.filter(t => t.status !== 'done').length || 0;

  // Kanban Board Logic: Tasks scoped to selected project
  const { tasks, updateTask, isLoading: tLoading } = useTasks(selectedProjectId);

  // Requirement: Project can only complete if tasks > 0 and ALL are done
  const isReadyToComplete = tasks.length > 0 && tasks.every(t => t.status === 'done');

  // --- 3. HANDLERS ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const overId = over.id;
    const newStatus = ['todo', 'in-progress', 'done'].includes(overId) ? overId : tasks.find(t => t.id === overId)?.status;
    if (newStatus && tasks.find(t => t.id === taskId).status !== newStatus) {
      updateTask({ id: taskId, status: newStatus });
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setActiveTab('kanban');
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  // Linear Navigation Logic (Board -> Gallery -> Dashboard)
  const handleBack = () => {
    if (selectedProjectId) {
      setSelectedProjectId(null); // Keluar dari board ke gallery
    } else {
      setActiveTab('dashboard'); // Keluar dari gallery/void ke dashboard
    }
  };

  // Handler Redirect Logo ke Dashboard
  const handleGoHome = () => {
    setActiveTab('dashboard');
    setSelectedProjectId(null); // Reset scope project saat klik logo
  };

  if (!user) return <Login onLoginSuccess={setUser} />;

  return (
    <div className="flex h-screen bg-[#FEFAE0] text-[#283618] font-sans overflow-hidden font-medium">
      <Toaster position="top-center" />
      
      <div className="flex-1 flex flex-col h-full relative">
        <Header 
          activeTab={activeTab} 
          onToggleSidebar={() => setIsSidebarOpen(true)} 
          onAddTask={() => setIsTaskModalOpen(true)}
          onAddVent={() => setIsVentModalOpen(true)}
          isLoading={tLoading || vLoading || pLoading}
          selectedProject={projects.find(p => p.id === selectedProjectId)}
          onBack={handleBack}
          onGoHome={handleGoHome} // Prop baru untuk handle redirect logo
          isReadyToComplete={isReadyToComplete}
          // Matikan Sidebar di Kanban dan Void agar navigasi lewat tombol back
          hideSidebarToggle={activeTab === 'kanban' || activeTab === 'void'} 
        />

        <main className="flex-1 p-10 overflow-y-auto bg-[#FEFAE0] scrollbar-hide">
          <AnimatePresence mode="wait">
            <Motion.div 
              key={activeTab + (selectedProjectId || 'none')} 
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  activeTasksCount={activeTasksCount} 
                  ventsCount={vents?.length || 0} 
                  onOpenVoid={() => setActiveTab('void')} 
                />
              )}

              {activeTab === 'kanban' && (
                <KanbanView 
                  projects={projects} 
                  tasks={tasks} 
                  selectedProjectId={selectedProjectId}
                  onSelectProject={handleSelectProject}
                  onOpenAddProject={() => setIsProjectModalOpen(true)}
                  onOpenAddTask={() => setIsTaskModalOpen(true)}
                  onEditTask={openEditModal}
                  sensors={sensors}
                  onDragEnd={handleDragEnd}
                />
              )}

              {activeTab === 'void' && (
                <VoidView 
                  vents={vents || []} 
                  onOpenAddVent={() => setIsVentModalOpen(true)} 
                />
              )}
            </Motion.div>
          </AnimatePresence>
        </main>
        <Footer userName={user?.displayName || 'Guest'} />
      </div>

      {/* Sidebar hanya boleh dibuka di Dashboard */}
      {activeTab === 'dashboard' && (
        <Sidebar 
          isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} 
          activeTab={activeTab} setActiveTab={setActiveTab} 
          user={user} setUser={setUser} onLogout={handleLogout} 
        />
      )}

      {/* MODAL OVERLAYS */}
      <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} projectId={selectedProjectId} />
      
      {/* Key fix cascading renders error */}
      <EditTaskModal 
        key={editingTask?.id || 'empty'}
        isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} 
        task={editingTask} projectId={selectedProjectId} 
      />
      
      <AddVentModal isOpen={isVentModalOpen} onClose={() => setIsVentModalOpen(false)} />
      <AddProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
    </div>
  );
}

export default App;