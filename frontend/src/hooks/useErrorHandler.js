// src/hooks/useErrorHandler.js
import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';

export function useErrorHandler() {
  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    // Determine error message based on error type
    let message = 'Ocorreu um erro inesperado.';
    let title = 'Erro';
    
    if (error?.message) {
      // Supabase errors
      if (error.message.includes('JWT')) {
        message = 'Sua sessão expirou. Por favor, faça login novamente.';
        title = 'Sessão expirada';
      } else if (error.message.includes('permission')) {
        message = 'Você não tem permissão para realizar esta ação.';
        title = 'Permissão negada';
      } else if (error.message.includes('network')) {
        message = 'Problema de conexão. Verifique sua internet e tente novamente.';
        title = 'Erro de conexão';
      } else {
        message = error.message;
      }
    }
    
    // Show notification
    notifications.show({
      title,
      message,
      color: 'red',
      autoClose: 5000,
    });
    
    // Return error for further handling if needed
    return { title, message, originalError: error };
  }, []);

  const handleSuccess = useCallback((message, title = 'Sucesso') => {
    notifications.show({
      title,
      message,
      color: 'green',
      autoClose: 3000,
    });
  }, []);

  const handleWarning = useCallback((message, title = 'Atenção') => {
    notifications.show({
      title,
      message,
      color: 'orange',
      autoClose: 4000,
    });
  }, []);

  const handleInfo = useCallback((message, title = 'Informação') => {
    notifications.show({
      title,
      message,
      color: 'blue',
      autoClose: 3000,
    });
  }, []);

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo
  };
}

