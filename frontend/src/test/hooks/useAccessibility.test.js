// src/test/hooks/useAccessibility.test.js
import { renderHook, act } from '@testing-library/react';
import { useAccessibility } from '../../hooks/useAccessibility';

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('useAccessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve detectar uso de teclado', () => {
    const { result } = renderHook(() => useAccessibility());

    expect(result.current.isKeyboardUser).toBe(false);

    // Simular pressionamento da tecla Tab
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(event);
    });

    expect(result.current.isKeyboardUser).toBe(true);
  });

  test('deve anunciar mensagens', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.announce('Teste de anúncio');
    });

    expect(result.current.announcements).toHaveLength(1);
    expect(result.current.announcements[0].message).toBe('Teste de anúncio');
  });

  test('deve gerar IDs únicos', () => {
    const { result } = renderHook(() => useAccessibility());

    const id1 = result.current.generateId('test');
    const id2 = result.current.generateId('test');

    expect(id1).toMatch(/^test-/);
    expect(id2).toMatch(/^test-/);
    expect(id1).not.toBe(id2);
  });

  test('deve verificar se elemento está visível', () => {
    const { result } = renderHook(() => useAccessibility());

    // Mock do getBoundingClientRect
    const mockElement = {
      getBoundingClientRect: () => ({
        width: 100,
        height: 100
      })
    };

    // Mock do getComputedStyle
    Object.defineProperty(window, 'getComputedStyle', {
      value: () => ({
        visibility: 'visible',
        display: 'block',
        opacity: '1'
      })
    });

    const isVisible = result.current.isElementVisible(mockElement);
    expect(isVisible).toBe(true);
  });

  test('deve verificar contraste de cores', () => {
    const { result } = renderHook(() => useAccessibility());

    const contrast = result.current.checkContrast('rgb(0, 0, 0)', 'rgb(255, 255, 255)');
    
    expect(contrast.ratio).toBeGreaterThan(20);
    expect(contrast.isAA).toBe(true);
    expect(contrast.isAAA).toBe(true);
  });

  test('deve navegar em listas com teclado', () => {
    const { result } = renderHook(() => useAccessibility());
    const items = ['item1', 'item2', 'item3'];
    const onSelect = jest.fn();

    const { focusedIndex, handleKeyDown } = result.current.useListNavigation(items, onSelect);

    expect(focusedIndex).toBe(-1);

    // Simular seta para baixo
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      handleKeyDown(event);
    });

    expect(focusedIndex).toBe(0);

    // Simular Enter
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      handleKeyDown(event);
    });

    expect(onSelect).toHaveBeenCalledWith('item1', 0);
  });
});
