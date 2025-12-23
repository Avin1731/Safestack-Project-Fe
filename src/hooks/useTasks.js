import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useTasks = () => {
  const queryClient = useQueryClient();

  // 1. Ambil semua Task
  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    },
  });

  // 2. Tambah Task Baru
  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await api.post('/tasks', newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // 3. Update Status Task (Drag & Drop)
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const res = await api.put(`/tasks/${id}`, updates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  // 4. Hapus Task (BARU)
  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/tasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate, // Pastikan ini di-return
  };
};