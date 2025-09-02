// src/hooks/useImoveis.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useErrorHandler } from './useErrorHandler';

export function useImoveis(user) {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError, handleSuccess } = useErrorHandler();

  const fetchImoveis = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ControleImoveisRurais')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setImoveis(data || []);
    } catch (error) {
      handleError(error, 'fetchImoveis');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createImovel = useCallback(async (imovelData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ControleImoveisRurais')
        .insert([{ ...imovelData, user_id: user.id }]);
      
      if (error) {
        throw error;
      }
      
      handleSuccess('Registro criado com sucesso.');
      
      await fetchImoveis();
      return { success: true };
    } catch (error) {
      handleError(error, 'createImovel');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [user, fetchImoveis]);

  const updateImovel = useCallback(async (id, imovelData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ControleImoveisRurais')
        .update(imovelData)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      handleSuccess('Registro atualizado com sucesso.');
      
      await fetchImoveis();
      return { success: true };
    } catch (error) {
      handleError(error, 'updateImovel');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchImoveis]);

  const deleteImovel = useCallback(async (id) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ControleImoveisRurais')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      handleSuccess('Registro deletado com sucesso.');
      
      await fetchImoveis();
      return { success: true };
    } catch (error) {
      handleError(error, 'deleteImovel');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchImoveis]);

  useEffect(() => {
    if (user) {
      fetchImoveis();
    }
  }, [user?.id]); // Dependência mais específica

  return {
    imoveis,
    loading,
    isSubmitting,
    fetchImoveis,
    createImovel,
    updateImovel,
    deleteImovel
  };
}
