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
import HistoryView from './pages/HistoryView'; 

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
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      // Validasi: pastikan data ada dan bukan string "undefined"
      if (savedUser && savedUser !== "undefined" && token) {
        return JSON.parse(savedUser);
      }
      return null;
    } catch { return null; }
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
    window.location.href = '/'; // Reset bersih ke login
  }, []);

  // --- 2. DATA FETCHING ---
  // Hook dipanggil di level atas, tapi Axios akan handle error 401 jika token invalid
  const { projects, isLoading: pLoading } = useProjects();
  const { vents, isLoading: vLoading } = useVents();
  
  const { tasks: allTasks } = useTasks(null);
  const activeTasksCount = allTasks?.filter(t => t.status !== 'done').length || 0;

  const { tasks, updateTask, isLoading: tLoading } = useTasks(selectedProjectId);
  const isReadyToComplete = tasks.length > 0 && tasks.every(t => t.status === 'done');

  const completedProjects = projects.filter(p => p.status === 'completed');
  const selectedProjectData = projects.find(p => p.id === selectedProjectId);
  const isProjectReadOnly = selectedProjectData?.status === 'completed';

  // --- 3. HANDLERS ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || isProjectReadOnly) return;
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

  const handleBack = () => {
    if (selectedProjectId) {
      setSelectedProjectId(null); 
    } else {
      setActiveTab('dashboard'); 
    }
  };

  const handleGoHome = () => {
    setActiveTab('dashboard');
    setSelectedProjectId(null); 
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
          selectedProject={selectedProjectData}
          onBack={handleBack}
          onGoHome={handleGoHome} 
          isReadyToComplete={isReadyToComplete}
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
                  isReadOnly={isProjectReadOnly}
                />
              )}

              {activeTab === 'void' && (
                <VoidView 
                  vents={vents || []} 
                  onOpenAddVent={() => setIsVentModalOpen(true)} 
                />
              )}

              {activeTab === 'history' && (
                <HistoryView 
                  completedProjects={completedProjects} 
                  onOpenProject={handleSelectProject} 
                />
              )}
            </Motion.div>
          </AnimatePresence>
        </main>
        <Footer userName={user?.displayName || 'Guest'} />
      </div>

      {/* KEY PROP: Ini penting agar state Sidebar ter-reset saat user ganti, tanpa useEffect */}
      <Sidebar 
        key={user?.id || 'guest'} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        setUser={setUser} 
        onLogout={handleLogout} 
      />

      {/* MODAL OVERLAYS */}
      <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} projectId={selectedProjectId} />
      
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