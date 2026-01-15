// src/hooks/useSupabaseError.js
import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';

export function useSupabaseError() {
  const handleSupabaseError = useCallback((error, context = '') => {
    console.error(`Supabase Error in ${context}:`, error);
    
    let message = 'Ocorreu um erro inesperado.';
    let title = 'Erro';
    let color = 'red';
    
    if (error?.message) {
      // Erros de CORS
      if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
        message = 'Erro de CORS. Verifique as configurações do Supabase.';
        title = 'Erro de Configuração';
        color = 'orange';
      }
      // Erros de autenticação
      else if (error.message.includes('JWT') || error.message.includes('token')) {
        message = 'Sessão expirada. Faça login novamente.';
        title = 'Sessão Expirada';
        color = 'yellow';
      }
      // Erros de permissão
      else if (error.message.includes('permission') || error.message.includes('403')) {
        message = 'Você não tem permissão para realizar esta ação.';
        title = 'Permissão Negada';
        color = 'red';
      }
      // Erros de rede
      else if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
        message = 'Problema de conexão. Verifique sua internet.';
        title = 'Erro de Conexão';
        color = 'orange';
      }
      // Erros de RLS (Row Level Security)
      else if (error.message.includes('RLS') || error.message.includes('row level security')) {
        message = 'Erro de segurança. Verifique as políticas do banco de dados.';
        title = 'Erro de Segurança';
        color = 'red';
      }
      // Outros erros
      else {
        message = error.message;
      }
    }
    
    // Mostrar notificação
    notifications.show({
      title,
      message,
      color,
      autoClose: 8000,
      withCloseButton: true,
    });
    
    return { title, message, color, originalError: error };
  }, []);

  const handleSupabaseSuccess = useCallback((message, title = 'Sucesso') => {
    notifications.show({
      title,
      message,
      color: 'green',
      autoClose: 3000,
    });
  }, []);

  return {
    handleSupabaseError,
    handleSupabaseSuccess
  };
}





