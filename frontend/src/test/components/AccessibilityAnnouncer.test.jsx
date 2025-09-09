// src/test/components/AccessibilityAnnouncer.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccessibilityAnnouncer, UrgentAnnouncer } from '../../components/AccessibilityAnnouncer';

describe('AccessibilityAnnouncer', () => {
  test('deve renderizar anúncios normais', () => {
    const announcements = [
      { id: 1, message: 'Teste de anúncio', priority: 'polite' }
    ];

    render(<AccessibilityAnnouncer announcements={announcements} />);
    
    const announcer = screen.getByRole('status');
    expect(announcer).toHaveAttribute('aria-live', 'polite');
    expect(announcer).toHaveAttribute('aria-atomic', 'true');
  });

  test('deve atualizar mensagem quando anúncios mudam', () => {
    const { rerender } = render(<AccessibilityAnnouncer announcements={[]} />);
    
    const announcements = [
      { id: 1, message: 'Primeira mensagem', priority: 'polite' }
    ];

    rerender(<AccessibilityAnnouncer announcements={announcements} />);
    
    const announcer = screen.getByRole('status');
    expect(announcer).toHaveTextContent('Primeira mensagem');
  });
});

describe('UrgentAnnouncer', () => {
  test('deve renderizar anúncios urgentes', () => {
    const announcements = [
      { id: 1, message: 'Alerta urgente', priority: 'assertive' }
    ];

    render(<UrgentAnnouncer announcements={announcements} />);
    
    const announcer = screen.getByRole('status');
    expect(announcer).toHaveAttribute('aria-live', 'assertive');
    expect(announcer).toHaveAttribute('aria-atomic', 'true');
  });

  test('deve ignorar anúncios não urgentes', () => {
    const announcements = [
      { id: 1, message: 'Mensagem normal', priority: 'polite' }
    ];

    render(<UrgentAnnouncer announcements={announcements} />);
    
    const announcer = screen.getByRole('status');
    expect(announcer).toHaveTextContent('');
  });
});
