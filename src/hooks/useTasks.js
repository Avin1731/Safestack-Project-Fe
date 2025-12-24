import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useTasks = (projectId) => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId], 
    queryFn: async () => {
      const params = projectId ? { projectId } : {};
      const res = await api.get('/tasks', { params }); 
      // Mapping _id ke id untuk stabilitas dnd-kit bngst
      return res.data.map(task => ({ ...task, id: task._id }));
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await api.post('/tasks', newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Tugas baru berhasil ditambahkan! ✨');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const res = await api.put(`/tasks/${id}`, updates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: () => toast.error('Gagal memperbarui status.'),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Tugas telah dihapus.');
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  };
};