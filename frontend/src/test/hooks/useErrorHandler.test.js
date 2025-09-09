// src/test/hooks/useErrorHandler.test.js
import { renderHook } from '@testing-library/react';
import { useErrorHandler } from '../../hooks/useErrorHandler';

// Mock das notificações do Mantine
jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn()
  }
}));

describe('useErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve tratar erros genéricos', () => {
    const { result } = renderHook(() => useErrorHandler());
    const { notifications } = require('@mantine/notifications');

    const error = new Error('Erro de teste');
    result.current.handleError(error, 'teste');

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Erro',
      message: 'Erro de teste',
      color: 'red',
      autoClose: 5000,
      withCloseButton: true,
    });
  });

  test('deve tratar erros de validação', () => {
    const { result } = renderHook(() => useErrorHandler());
    const { notifications } = require('@mantine/notifications');

    const errors = {
      nome: 'Nome é obrigatório',
      email: 'Email inválido'
    };

    result.current.handleValidationError(errors);

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Erro de Validação',
      message: 'Nome é obrigatório, Email inválido',
      color: 'orange',
      autoClose: 5000,
      withCloseButton: true,
    });
  });

  test('deve tratar erros de rede', () => {
    const { result } = renderHook(() => useErrorHandler());
    const { notifications } = require('@mantine/notifications');

    const error = new Error('Failed to fetch');
    result.current.handleNetworkError(error);

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Erro de Rede',
      message: 'Verifique sua conexão com a internet',
      color: 'red',
      autoClose: 7000,
      withCloseButton: true,
    });
  });

  test('deve tratar erros de autenticação', () => {
    const { result } = renderHook(() => useErrorHandler());
    const { notifications } = require('@mantine/notifications');

    const error = new Error('Invalid credentials');
    result.current.handleAuthError(error);

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Erro de Autenticação',
      message: 'Credenciais inválidas',
      color: 'red',
      autoClose: 5000,
      withCloseButton: true,
    });
  });

  test('deve mostrar mensagem de sucesso', () => {
    const { result } = renderHook(() => useErrorHandler());
    const { notifications } = require('@mantine/notifications');

    result.current.handleSuccess('Operação realizada com sucesso!');

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Sucesso',
      message: 'Operação realizada com sucesso!',
      color: 'green',
      autoClose: 3000,
      withCloseButton: true,
    });
  });

  test('deve tratar diferentes tipos de erro de rede', () => {
    const { result } = renderHook(() => useErrorHandler());
    const { notifications } = require('@mantine/notifications');

    // Teste timeout
    const timeoutError = new Error('timeout');
    result.current.handleNetworkError(timeoutError);

    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Erro de Rede',
      message: 'A operação demorou muito para ser concluída',
      color: 'red',
      autoClose: 7000,
      withCloseButton: true,
    });
  });
});
