/**
 * Hook para gerenciar loading, error e retry
 * Centraliza lógica de requisições com melhor UX
 */
import { useState, useCallback } from 'react';
import { logger } from '../utils/logger';

export const useAsyncOperation = (asyncFn, onSuccess, onError) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  });

  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const execute = useCallback(async (...args) => {
    setState({ loading: true, error: null, data: null });
    
    try {
      logger.info(`Iniciando operação (tentativa ${retryCount + 1})`);
      const result = await asyncFn(...args);
      
      setState({ loading: false, error: null, data: result });
      logger.info('Operação concluída com sucesso');
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      setRetryCount(0); // Reset retry count on success
      return result;
    } catch (error) {
      logger.error(`Erro na operação: ${error.message}`, error);
      
      setState({ 
        loading: false, 
        error: error.message || 'Erro ao executar operação',
        data: null 
      });
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  }, [asyncFn, onSuccess, onError, retryCount]);

  const retry = useCallback(async (...args) => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      logger.warn(`Tentando novamente (${retryCount + 1}/${maxRetries})`);
      return execute(...args);
    } else {
      logger.error('Número máximo de tentativas atingido');
      throw new Error('Número máximo de tentativas atingido');
    }
  }, [retryCount, execute]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
    setRetryCount(0);
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    canRetry: retryCount < maxRetries,
    retryCount,
  };
};
