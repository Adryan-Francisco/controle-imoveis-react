// src/test/components/OfflineStatus.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { OfflineStatus } from '../../components/OfflineStatus';

// Mock do hook de acessibilidade
jest.mock('../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    announce: jest.fn(),
    generateId: () => 'test-id'
  })
}));

describe('OfflineStatus', () => {
  const defaultProps = {
    isOnline: true,
    isSyncing: false,
    pendingChanges: 0,
    lastSync: null,
    onSync: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve renderizar status online compacto', () => {
    render(<OfflineStatus {...defaultProps} compact />);
    
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Online');
    expect(badge).toHaveAttribute('aria-label', 'Status: Online');
  });

  test('deve renderizar status offline compacto', () => {
    render(<OfflineStatus {...defaultProps} isOnline={false} compact />);
    
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Offline');
    expect(badge).toHaveAttribute('aria-label', 'Status: Offline');
  });

  test('deve mostrar alterações pendentes', () => {
    render(<OfflineStatus {...defaultProps} pendingChanges={3} compact />);
    
    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('Online (3)');
    expect(badge).toHaveAttribute('aria-label', 'Status: Online, 3 alterações pendentes');
  });

  test('deve renderizar alerta completo quando offline', () => {
    render(<OfflineStatus {...defaultProps} isOnline={false} />);
    
    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('Modo Offline');
    expect(alert).toHaveAttribute('aria-label', 'Status de conexão: Offline');
  });

  test('deve renderizar botão de sincronização quando há alterações pendentes', () => {
    render(<OfflineStatus {...defaultProps} pendingChanges={2} />);
    
    const button = screen.getByRole('button', { name: /sincronizar alterações agora/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  test('deve desabilitar botão durante sincronização', () => {
    render(<OfflineStatus {...defaultProps} pendingChanges={2} isSyncing />);
    
    const button = screen.getByRole('button', { name: /sincronizar alterações agora/i });
    expect(button).toBeDisabled();
  });

  test('deve chamar onSync quando botão for clicado', () => {
    const onSync = jest.fn();
    render(<OfflineStatus {...defaultProps} pendingChanges={2} onSync={onSync} />);
    
    const button = screen.getByRole('button', { name: /sincronizar alterações agora/i });
    fireEvent.click(button);
    
    expect(onSync).toHaveBeenCalledTimes(1);
  });

  test('deve mostrar barra de progresso durante sincronização', () => {
    render(<OfflineStatus {...defaultProps} pendingChanges={2} isSyncing />);
    
    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-label', 'Sincronização em andamento');
  });

  test('deve mostrar última sincronização', () => {
    const lastSync = new Date('2024-01-01T12:00:00Z');
    render(<OfflineStatus {...defaultProps} lastSync={lastSync} />);
    
    expect(screen.getByText(/última sincronização/i)).toBeInTheDocument();
  });

  test('deve mostrar mensagem de sincronização concluída', () => {
    const lastSync = new Date();
    render(<OfflineStatus {...defaultProps} lastSync={lastSync} pendingChanges={0} />);
    
    expect(screen.getByText(/sincronização concluída/i)).toBeInTheDocument();
  });

  test('não deve renderizar quando online e sem alterações pendentes', () => {
    const { container } = render(<OfflineStatus {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });
});
