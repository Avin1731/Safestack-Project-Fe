import React, { useState, useCallback, useMemo } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Login from './pages/Login';

// Pages
import Dashboard from './pages/Dashboard';
import KanbanView from './pages/KanbanView';
import VoidView from './pages/VoidView';
import HistoryView from './pages/HistoryView'; 
import ProfileView from './pages/ProfileView';

// Modals
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import AddVentModal from './components/AddVentModal';
import AddProjectModal from './components/AddProjectModal';

// Hooks
import { useTasks } from './hooks/useTasks';
import { useVents } from './hooks/useVents';
import { useProjects } from './hooks/useProjects';

function App() {
  // --- 1. AUTH STATE ---
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (savedUser && savedUser !== "undefined" && token) {
        return JSON.parse(savedUser);
      }
      return null;
    } catch { return null; }
  });

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // --- 2. NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   
  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isVentModalOpen, setIsVentModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // --- 3. DATA FETCHING ---
  const { projects, isLoading: pLoading } = useProjects();
  const { vents, isLoading: vLoading } = useVents();
  const { tasks: allTasks } = useTasks(null); 
  const { tasks, updateTask, isLoading: tLoading } = useTasks(selectedProjectId);

  // --- 4. COMPUTED STATS ---
  const activeTasksCount = useMemo(() => 
    allTasks?.filter(t => t.status !== 'done').length || 0, 
  [allTasks]);

  const isReadyToComplete = useMemo(() => 
    tasks.length > 0 && tasks.every(t => t.status === 'done'), 
  [tasks]);

  const completedProjects = useMemo(() => 
    projects.filter(p => p.status === 'completed'), 
  [projects]);

  const profileStats = useMemo(() => ({
    inProgress: projects.filter(p => p.status !== 'completed').length,
    completed: projects.filter(p => p.status === 'completed').length,
    vents: vents?.length || 0
  }), [projects, vents]);

  const selectedProjectData = useMemo(() => 
    projects.find(p => (p.id === selectedProjectId || p._id === selectedProjectId)), 
  [projects, selectedProjectId]);
   
  const isProjectReadOnly = selectedProjectData?.status === 'completed';

  // --- 5. HANDLERS ---
  const handleLogout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/';
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over || isProjectReadOnly) return;

    const taskId = active.id;
    const overId = over.id;
    const currentTask = tasks.find(t => (t.id === taskId || t._id === taskId));

    const newStatus = ['todo', 'in-progress', 'done'].includes(overId) 
      ? overId 
      : tasks.find(t => (t.id === overId || t._id === overId))?.status;

    if (newStatus && currentTask && currentTask.status !== newStatus) {
      updateTask({ id: taskId, status: newStatus });
    }
  }, [tasks, isProjectReadOnly, updateTask]);

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
      if (isProjectReadOnly) setActiveTab('history');
      setSelectedProjectId(null); 
    } else {
      setActiveTab('dashboard'); 
    }
  };

  const handleGoHome = () => {
    setActiveTab('dashboard');
    setSelectedProjectId(null); 
  };

  // --- 6. RENDER ---
  if (!user) return <Login onLoginSuccess={setUser} />;

  return (
    // INI BAGIAN PENTING: CLASS GLOBAL UNTUK WARNA BACKGROUND & TEXT
    <div className="flex h-screen font-sans overflow-hidden selection:bg-olive/20 transition-colors duration-300
      bg-cream text-forest dark:bg-dark-bg dark:text-dark-text">
      
      <Toaster position="top-center" toastOptions={{ className: 'font-bold text-sm rounded-2xl' }} />
       
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

        {/* CONTAINER MAIN JUGA HARUS IKUT BERUBAH WARNA */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto scrollbar-hide transition-colors duration-300 bg-cream dark:bg-dark-bg">
          <AnimatePresence mode="wait">
            <Motion.div 
              key={activeTab + (selectedProjectId || 'none')} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  userName={user?.displayName}
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

              {activeTab === 'profile' && (
                <ProfileView 
                  user={user}
                  onUpdateUser={handleUpdateUser}
                  stats={profileStats}
                />
              )}
            </Motion.div>
          </AnimatePresence>
        </main>
        
        {activeTab !== 'profile' && <Footer userName={user?.displayName || 'Guest'} />}
      </div>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
      />

      <AnimatePresence>
        {isTaskModalOpen && (
          <AddTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} projectId={selectedProjectId} />
        )}
        {isEditModalOpen && (
          <EditTaskModal 
            key={editingTask?.id || editingTask?._id || 'empty'}
            isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} 
            task={editingTask} projectId={selectedProjectId} 
          />
        )}
        {isVentModalOpen && (
          <AddVentModal isOpen={isVentModalOpen} onClose={() => setIsVentModalOpen(false)} />
        )}
        {isProjectModalOpen && (
          <AddProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;