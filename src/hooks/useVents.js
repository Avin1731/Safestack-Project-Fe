import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useVents = (filter = 'all', sort = 'newest') => {
  const queryClient = useQueryClient();

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // 1. GET VENTS
  const ventsQuery = useQuery({
    queryKey: ['vents', filter, sort],
    queryFn: async () => {
      const res = await api.get(`/vents?filter=${filter}&sort=${sort}`, { headers: getHeaders() });
      return res.data;
    },
  });

  // 2. GET STATS (Sidebar Data)
  const statsQuery = useQuery({
    queryKey: ['ventStats'],
    queryFn: async () => {
      const res = await api.get('/vents/stats', { headers: getHeaders() });
      return res.data;
    }
  });

  // --- MUTATIONS ---
  const createVentMutation = useMutation({
    mutationFn: async (newVent) => {
      const res = await api.post('/vents', newVent, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      queryClient.invalidateQueries({ queryKey: ['ventStats'] }); // Refresh counter juga
      toast.success('Suara hati terkirim... 🍃', {
        style: { borderRadius: '15px', background: '#606C38', color: '#fff' }
      });
    },
  });

  const toggleSupportMutation = useMutation({
    mutationFn: async (id) => {
      await api.put(`/vents/${id}/support`, {}, { headers: getHeaders() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      queryClient.invalidateQueries({ queryKey: ['ventStats'] }); // Refresh trending
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ id, content }) => {
      await api.post(`/vents/${id}/comments`, { content }, { headers: getHeaders() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      toast.success('Responmu terkirim.');
    }
  });

  const deleteVentMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/vents/${id}`, { headers: getHeaders() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      queryClient.invalidateQueries({ queryKey: ['ventStats'] });
      toast.success('Dihapus.');
    },
    onError: () => toast.error('Bukan milikmu.'),
  });

  return {
    vents: ventsQuery.data || [],
    stats: statsQuery.data || { counts: {}, trending: {} }, // Default value biar gak error
    isLoading: ventsQuery.isLoading,
    createVent: createVentMutation.mutate,
    toggleSupport: toggleSupportMutation.mutate,
    addComment: addCommentMutation.mutate,
    deleteVent: deleteVentMutation.mutate,
  };
};