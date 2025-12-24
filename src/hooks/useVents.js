import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useVents = () => {
  const queryClient = useQueryClient();

  const ventsQuery = useQuery({
    queryKey: ['vents'],
    queryFn: async () => {
      const res = await api.get('/vents');
      return res.data;
    },
  });

  const createVentMutation = useMutation({
    mutationFn: async (newVent) => {
      const res = await api.post('/vents', newVent);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      toast.success('Pikiranmu telah dilepaskan ke Void... 🌬️', {
        style: { borderRadius: '15px', background: '#606C38', color: '#fff' }
      });
    },
  });

  const deleteVentMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/vents/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      toast.success('Pesan telah ditarik dari semesta.');
    },
    onError: () => toast.error('Hanya pemilik yang bisa menghapus ini.'),
  });

  return {
    vents: ventsQuery.data || [],
    isLoading: ventsQuery.isLoading,
    createVent: createVentMutation.mutate,
    deleteVent: deleteVentMutation.mutate,
  };
};