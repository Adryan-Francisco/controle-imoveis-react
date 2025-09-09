// src/hooks/useImoveisQuery.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabaseClient';
import { useErrorHandler } from './useErrorHandler';
import { config } from '../config/env';

// Query keys
export const imoveisKeys = {
  all: ['imoveis'],
  lists: () => [...imoveisKeys.all, 'list'],
  list: (filters) => [...imoveisKeys.lists(), { filters }],
  details: () => [...imoveisKeys.all, 'detail'],
  detail: (id) => [...imoveisKeys.details(), id],
  statistics: (userId) => [...imoveisKeys.all, 'statistics', userId],
};

// Função para buscar imóveis com paginação e filtros
export async function fetchImoveis({ userId, page = 1, pageSize = 10, filters = {} }) {
  try {
    const { data, error, count } = await supabase
      .from('ControleImoveisRurais')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('id', { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      console.error('❌ Erro na consulta:', error);
      throw error;
    }
    
    return {
      data: data || [],
      totalCount: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  } catch (error) {
    console.error('💥 Erro em fetchImoveis:', error);
    throw error;
  }
}

// Hook para buscar imóveis
export function useImoveisQuery(userId, options = {}) {
  const { page = 1, pageSize = 10, filters = {}, enabled = true } = options;
  
  return useQuery({
    queryKey: imoveisKeys.list({ userId, page, pageSize, filters }),
    queryFn: () => fetchImoveis({ userId, page, pageSize, filters }),
    enabled: enabled && !!userId,
    staleTime: config.cache.staleTime,
    cacheTime: config.cache.cacheTime,
    keepPreviousData: true, // Manter dados anteriores durante loading
  });
}

// Hook para estatísticas
export function useImoveisStatistics(userId) {
  return useQuery({
    queryKey: imoveisKeys.statistics(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ControleImoveisRurais')
        .select('status_pagamento, valor, data_vencimento')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Calcular estatísticas
      const totalImoveis = data.length;
      const imoveisPagos = data.filter(i => i.status_pagamento === 'PAGO').length;
      const imoveisPendentes = data.filter(i => i.status_pagamento === 'PENDENTE').length;
      const imoveisAtrasados = data.filter(i => i.status_pagamento === 'ATRASADO').length;
      
      const valorTotal = data.reduce((sum, i) => sum + (i.valor || 0), 0);
      const valorPendente = data
        .filter(i => i.status_pagamento === 'PENDENTE' || i.status_pagamento === 'ATRASADO')
        .reduce((sum, i) => sum + (i.valor || 0), 0);
      
      const taxaPagamento = totalImoveis > 0 ? (imoveisPagos / totalImoveis) * 100 : 0;
      
      return {
        totalImoveis,
        imoveisPagos,
        imoveisPendentes,
        imoveisAtrasados,
        valorTotal,
        valorPendente,
        taxaPagamento
      };
    },
    enabled: !!userId,
    staleTime: config.cache.staleTime,
  });
}

// Hook para criar imóvel
export function useCreateImovel() {
  const queryClient = useQueryClient();
  const { handleError, handleSuccess } = useErrorHandler();
  
  return useMutation({
    mutationFn: async ({ imovelData, userId }) => {
      const { error } = await supabase
        .from('ControleImoveisRurais')
        .insert([{ ...imovelData, user_id: userId }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: imoveisKeys.all });
      handleSuccess('Registro criado com sucesso.');
    },
    onError: (error) => {
      handleError(error, 'createImovel');
    },
  });
}

// Hook para atualizar imóvel
export function useUpdateImovel() {
  const queryClient = useQueryClient();
  const { handleError, handleSuccess } = useErrorHandler();
  
  return useMutation({
    mutationFn: async ({ id, imovelData }) => {
      const { error } = await supabase
        .from('ControleImoveisRurais')
        .update(imovelData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imoveisKeys.all });
      handleSuccess('Registro atualizado com sucesso.');
    },
    onError: (error) => {
      handleError(error, 'updateImovel');
    },
  });
}

// Hook para deletar imóvel
export function useDeleteImovel() {
  const queryClient = useQueryClient();
  const { handleError, handleSuccess } = useErrorHandler();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('ControleImoveisRurais')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: imoveisKeys.all });
      handleSuccess('Registro deletado com sucesso.');
    },
    onError: (error) => {
      handleError(error, 'deleteImovel');
    },
  });
}
