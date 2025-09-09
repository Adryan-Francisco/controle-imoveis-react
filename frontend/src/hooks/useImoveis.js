// src/hooks/useImoveis.js
import { useCallback } from 'react';
import { useImoveisQuery, useCreateImovel, useUpdateImovel, useDeleteImovel } from './useImoveisQuery';
import { useSecurityValidation } from './useSecurityValidation';
import { useErrorHandler } from './useErrorHandler';
import { validateImovelData, formatCurrency } from '../utils';

export function useImoveis(user, options = {}) {
  const { page = 1, pageSize = 10, filters = {} } = options;
  
  // Hooks de segurança e tratamento de erro
  const { validateImovelData, sanitizeImovelData, checkRateLimit } = useSecurityValidation();
  const { handleError, handleSuccess, handleValidationError } = useErrorHandler();
  
  // Usar React Query para buscar dados
  const { 
    data: queryData, 
    isLoading, 
    error, 
    refetch 
  } = useImoveisQuery(user?.id, { page, pageSize, filters });
  
  // Mutations
  const createMutation = useCreateImovel();
  const updateMutation = useUpdateImovel();
  const deleteMutation = useDeleteImovel();
  
  const imoveis = queryData?.data || [];
  const totalCount = queryData?.totalCount || 0;
  const totalPages = queryData?.totalPages || 0;

  // Funções de CRUD usando mutations com otimização e segurança
  const createImovel = useCallback(async (imovelData) => {
    if (!user?.id) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    
    // Verificar rate limiting
    const rateLimitCheck = checkRateLimit('create_imovel', 5, 60000);
    if (!rateLimitCheck.allowed) {
      return { success: false, error: rateLimitCheck.error };
    }
    
    // Validar dados
    const validation = validateImovelData(imovelData);
    if (!validation.isValid) {
      handleValidationError(validation.errors);
      return { success: false, error: 'Dados inválidos', errors: validation.errors };
    }
    
    // Sanitizar dados
    const sanitizedData = sanitizeImovelData(imovelData);
    
    try {
      await createMutation.mutateAsync({ 
        imovelData: sanitizedData, 
        userId: user.id 
      });
      handleSuccess('Imóvel criado com sucesso!');
      return { success: true };
    } catch (error) {
      handleError(error, 'criar imóvel');
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  }, [createMutation, user?.id, checkRateLimit, validateImovelData, sanitizeImovelData, handleValidationError, handleSuccess, handleError]);

  const updateImovel = useCallback(async (id, imovelData) => {
    if (!id) {
      return { success: false, error: 'ID do imóvel é obrigatório' };
    }
    
    // Verificar rate limiting
    const rateLimitCheck = checkRateLimit('update_imovel', 10, 60000);
    if (!rateLimitCheck.allowed) {
      return { success: false, error: rateLimitCheck.error };
    }
    
    // Validar dados
    const validation = validateImovelData(imovelData);
    if (!validation.isValid) {
      handleValidationError(validation.errors);
      return { success: false, error: 'Dados inválidos', errors: validation.errors };
    }
    
    // Sanitizar dados
    const sanitizedData = sanitizeImovelData(imovelData);
    
    try {
      await updateMutation.mutateAsync({ id, imovelData: sanitizedData });
      handleSuccess('Imóvel atualizado com sucesso!');
      return { success: true };
    } catch (error) {
      handleError(error, 'atualizar imóvel');
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  }, [updateMutation, checkRateLimit, validateImovelData, sanitizeImovelData, handleValidationError, handleSuccess, handleError]);

  const deleteImovel = useCallback(async (id) => {
    if (!id) {
      return { success: false, error: 'ID do imóvel é obrigatório' };
    }
    
    // Verificar rate limiting
    const rateLimitCheck = checkRateLimit('delete_imovel', 3, 60000);
    if (!rateLimitCheck.allowed) {
      return { success: false, error: rateLimitCheck.error };
    }
    
    try {
      await deleteMutation.mutateAsync(id);
      handleSuccess('Imóvel excluído com sucesso!');
      return { success: true };
    } catch (error) {
      handleError(error, 'deletar imóvel');
      return { success: false, error: error.message || 'Erro desconhecido' };
    }
  }, [deleteMutation, checkRateLimit, handleSuccess, handleError]);

  // Função para recarregar dados
  const fetchImoveis = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    imoveis,
    loading: isLoading,
    isSubmitting: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    error,
    totalCount,
    totalPages,
    fetchImoveis,
    createImovel,
    updateImovel,
    deleteImovel,
    // Estados das mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}