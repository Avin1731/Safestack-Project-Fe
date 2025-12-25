import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const queryClient = useQueryClient();

  // 1. Fetch All Projects
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  // 2. Create New Project
  const createProjectMutation = useMutation({
    mutationFn: async (newProject) => {
      const res = await api.post('/projects', newProject);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Workspace baru berhasil dibuat! 📁');
    },
    onError: (error) => {
      console.error(error.response?.data);
      toast.error('Gagal membuat workspace.');
    }
  });

  // 3. Complete Project (INI YANG KURANG KEMARIN)
  const completeProjectMutation = useMutation({
    mutationFn: async (projectId) => {
      // Pastikan backend support endpoint ini (PATCH /projects/:id)
      const res = await api.patch(`/projects/${projectId}`, { status: 'completed' });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // Refresh list project
      queryClient.invalidateQueries({ queryKey: ['tasks'] });    // Refresh task juga biar sinkron
      toast.success('Project selesai! Masuk ke history. 🎉');
    },
    onError: (error) => {
      console.error("Gagal complete project:", error);
      toast.error('Gagal menyelesaikan project.');
    }
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    createProject: createProjectMutation.mutate,
    // Export fungsi ini biar bisa dipake di Header.jsx
    completeProject: completeProjectMutation.mutate, 
  };
};