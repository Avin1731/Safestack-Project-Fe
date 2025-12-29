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

  // 2. GET STATS
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
      queryClient.invalidateQueries({ queryKey: ['ventStats'] });
      toast.success('Suara hati terkirim... 🍃', {
        style: { borderRadius: '15px', background: '#606C38', color: '#fff' }
      });
    },
  });

  // FIX: Support Mutation now returns data so UI can sync
  const toggleSupportMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/vents/${id}/support`, {}, { headers: getHeaders() });
      return res.data; // Return the data object directly
    },
    onSuccess: () => {
      // Invalidate queries so sidebar trending & count also update
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      queryClient.invalidateQueries({ queryKey: ['ventStats'] });
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: async ({ id, content }) => {
      const res = await api.post(`/vents/${id}/comments`, { content }, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      toast.success('Responmu terkirim.');
    }
  });

  const deleteVentMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/vents/${id}`, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      queryClient.invalidateQueries({ queryKey: ['ventStats'] });
      toast.success('Dihapus.');
    },
    onError: () => toast.error('Bukan milikmu.'),
  });

  // Like Comment
  const toggleCommentLikeMutation = useMutation({
    mutationFn: async ({ ventId, commentId }) => {
      const res = await api.put(`/vents/${ventId}/comments/${commentId}/like`, {}, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
    }
  });

  // Reply Comment (With Tagging replyTo)
  const replyCommentMutation = useMutation({
    mutationFn: async ({ ventId, commentId, content, replyTo }) => {
      const res = await api.post(`/vents/${ventId}/comments/${commentId}/reply`, { content, replyTo }, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
      toast.success('Balasan terkirim 🔥');
    }
  });

  // Like Reply
  const toggleReplyLikeMutation = useMutation({
    mutationFn: async ({ ventId, commentId, replyId }) => {
      const res = await api.put(`/vents/${ventId}/comments/${commentId}/replies/${replyId}/like`, {}, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vents'] });
    }
  });

  return {
    vents: ventsQuery.data || [],
    stats: statsQuery.data || { counts: {}, trending: {} },
    isLoading: ventsQuery.isLoading,
    
    // Use .mutate for "Fire and Forget" actions
    createVent: createVentMutation.mutate,
    addComment: addCommentMutation.mutate,
    deleteVent: deleteVentMutation.mutate,
    
    // IMPORTANT: Use .mutateAsync for actions that need 'await' in the component
    // to catch response.data or errors in try/catch
    toggleSupport: toggleSupportMutation.mutateAsync, 
    toggleCommentLike: toggleCommentLikeMutation.mutateAsync,
    replyComment: replyCommentMutation.mutateAsync,
    toggleReplyLike: toggleReplyLikeMutation.mutateAsync,
  };
};