import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const useVents = () => {
  const queryClient = useQueryClient();

  // 1. Ambil semua Vent
  const ventsQuery = useQuery({
    queryKey: ['vents'],
    queryFn: async () => {
      const res = await api.get('/vents');
      return res.data;
    },
  });

  // 2. Kirim Vent Baru
  const createVentMutation = useMutation({
    mutationFn: async (newVent) => {
      const res = await api.post('/vents', newVent);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vents']);
    },
  });

  return {
    vents: ventsQuery.data || [],
    isLoading: ventsQuery.isLoading,
    createVent: createVentMutation.mutate,
  };
};