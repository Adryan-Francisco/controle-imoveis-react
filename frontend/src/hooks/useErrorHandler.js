// src/hooks/useErrorHandler.js
import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';

export function useErrorHandler() {
  // Tratar erros de forma centralizada
  const handleError = useCallback((error, context = '') => {
    console.error(`Erro em ${context}:`, error);
    
    let message = 'Ocorreu um erro inesperado';
    let title = 'Erro';
    
    // Tratar diferentes tipos de erro
    if (error?.code === 'PGRST116') {
      message = 'Dados não encontrados';
      title = 'Informação';
    } else if (error?.code === '23505') {
      message = 'Este registro já existe';
      title = 'Duplicação';
    } else if (error?.code === '23503') {
      message = 'Não é possível excluir este registro pois está sendo usado';
      title = 'Restrição';
    } else if (error?.message) {
      message = error.message;
    }
    
    // Mostrar notificação de erro
    notifications.show({
      title,
      message,
      color: 'red',
      autoClose: 5000,
      withCloseButton: true,
    });
    
    return { message, title };
  }, []);

  // Tratar erros de validação
  const handleValidationError = useCallback((errors) => {
    const errorMessages = Object.values(errors).filter(Boolean);
    
    if (errorMessages.length > 0) {
      notifications.show({
        title: 'Erro de Validação',
        message: errorMessages.join(', '),
        color: 'orange',
        autoClose: 5000,
        withCloseButton: true,
      });
    }
  }, []);

  // Tratar erros de rede
  const handleNetworkError = useCallback((error) => {
    let message = 'Erro de conexão';
    
    if (error?.message?.includes('Failed to fetch')) {
      message = 'Verifique sua conexão com a internet';
    } else if (error?.message?.includes('timeout')) {
      message = 'A operação demorou muito para ser concluída';
    }
    
    notifications.show({
      title: 'Erro de Rede',
      message,
      color: 'red',
      autoClose: 7000,
      withCloseButton: true,
    });
  }, []);

  // Tratar erros de autenticação
  const handleAuthError = useCallback((error) => {
    let message = 'Erro de autenticação';
    
    if (error?.message?.includes('Invalid credentials')) {
      message = 'Credenciais inválidas';
    } else if (error?.message?.includes('User not found')) {
      message = 'Usuário não encontrado';
    } else if (error?.message?.includes('Email not confirmed')) {
      message = 'Email não confirmado';
    }
    
    notifications.show({
      title: 'Erro de Autenticação',
      message,
      color: 'red',
      autoClose: 5000,
      withCloseButton: true,
    });
  }, []);

  // Tratar sucesso
  const handleSuccess = useCallback((message, title = 'Sucesso') => {
    notifications.show({
      title,
      message,
      color: 'green',
      autoClose: 3000,
      withCloseButton: true,
    });
  }, []);

  return {
    handleError,
    handleValidationError,
    handleNetworkError,
    handleAuthError,
    handleSuccess
  };
}