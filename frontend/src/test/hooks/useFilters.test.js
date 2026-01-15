// src/test/hooks/useFilters.test.js
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilters } from '../../hooks/useFilters';

// Mock do useDebounce
vi.mock('../../hooks/useDebounce', () => ({
  useDebounce: (value) => value // Retorna o valor sem debounce para testes
}));

describe('useFilters', () => {
  const mockData = [
    {
      id: 1,
      proprietario: 'João Silva',
      sitio: 'Fazenda São João',
      status_pagamento: 'PAGO',
      valor: 1000,
      data_vencimento: '2024-01-15'
    },
    {
      id: 2,
      proprietario: 'Maria Santos',
      sitio: 'Sítio da Paz',
      status_pagamento: 'PENDENTE',
      valor: 2000,
      data_vencimento: '2024-02-20'
    },
    {
      id: 3,
      proprietario: 'Pedro Costa',
      sitio: 'Fazenda Verde',
      status_pagamento: 'ATRASADO',
      valor: 1500,
      data_vencimento: '2024-01-10'
    }
  ];

  it('should initialize with default filters', () => {
    const { result } = renderHook(() => useFilters());
    
    expect(result.current.filters).toEqual({
      search: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      valorMin: null,
      valorMax: null
    });
    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.activeFiltersCount).toBe(0);
  });

  it('should initialize with custom filters', () => {
    const initialFilters = { status: 'PAGO', search: 'João' };
    const { result } = renderHook(() => useFilters(initialFilters));
    
    expect(result.current.filters.status).toBe('PAGO');
    expect(result.current.filters.search).toBe('João');
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.activeFiltersCount).toBe(2);
  });

  it('should update single filter', () => {
    const { result } = renderHook(() => useFilters());
    
    act(() => {
      result.current.updateFilter('status', 'PAGO');
    });
    
    expect(result.current.filters.status).toBe('PAGO');
    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.activeFiltersCount).toBe(1);
  });

  it('should update multiple filters', () => {
    const { result } = renderHook(() => useFilters());
    
    act(() => {
      result.current.updateFilters({
        status: 'PAGO',
        search: 'João',
        valorMin: 500
      });
    });
    
    expect(result.current.filters.status).toBe('PAGO');
    expect(result.current.filters.search).toBe('João');
    expect(result.current.filters.valorMin).toBe(500);
    expect(result.current.activeFiltersCount).toBe(3);
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useFilters({ status: 'PAGO', search: 'João' }));
    
    act(() => {
      result.current.clearFilters();
    });
    
    expect(result.current.filters).toEqual({
      search: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      valorMin: null,
      valorMax: null
    });
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('should clear single filter', () => {
    const { result } = renderHook(() => useFilters({ status: 'PAGO', search: 'João' }));
    
    act(() => {
      result.current.clearFilter('status');
    });
    
    expect(result.current.filters.status).toBe('');
    expect(result.current.filters.search).toBe('João');
    expect(result.current.activeFiltersCount).toBe(1);
  });

  it('should apply search filter correctly', () => {
    const { result } = renderHook(() => useFilters());
    
    act(() => {
      result.current.updateFilter('search', 'João');
    });
    
    const filteredData = result.current.applyFilters(mockData);
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].proprietario).toBe('João Silva');
  });

  it('should apply status filter correctly', () => {
    const { result } = renderHook(() => useFilters());
    
    act(() => {
      result.current.updateFilter('status', 'PAGO');
    });
    
    const filteredData = result.current.applyFilters(mockData);
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].status_pagamento).toBe('PAGO');
  });

  it('should apply date range filter correctly', () => {
    const { result } = renderHook(() => useFilters());
    
    act(() => {
      result.current.updateFilters({
        dateFrom: new Date('2024-01-01'),
        dateTo: new Date('2024-01-31')
      });
    });
    
    const filteredData = result.current.applyFilters(mockData);
    expect(filteredData).toHaveLength(2); // Items with dates in January
  });

  it('should apply value range filter correctly', () => {
    const { result } = renderHook(() => useFilters());
    
    act(() => {
      result.current.updateFilters({
        valorMin: 1000,
        valorMax: 1500
      });
    });
    
    const filteredData = result.current.applyFilters(mockData);
    expect(filteredData).toHaveLength(2);
    expect(filteredData.every(item => item.valor >= 1000 && item.valor <= 1500)).toBe(true);
  });

  it('should apply multiple filters simultaneously', () => {
    const { result } = renderHook(() => useFilters());
    
    act(() => {
      result.current.updateFilters({
        status: 'PAGO',
        valorMin: 500
      });
    });
    
    const filteredData = result.current.applyFilters(mockData);
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].status_pagamento).toBe('PAGO');
    expect(filteredData[0].valor).toBeGreaterThanOrEqual(500);
  });

  it('should return all data when no filters applied', () => {
    const { result } = renderHook(() => useFilters());
    
    const filteredData = result.current.applyFilters(mockData);
    expect(filteredData).toHaveLength(mockData.length);
  });

  it('should handle empty data array', () => {
    const { result } = renderHook(() => useFilters());
    
    const filteredData = result.current.applyFilters([]);
    expect(filteredData).toHaveLength(0);
  });

  it('should handle null/undefined data', () => {
    const { result } = renderHook(() => useFilters());
    
    const filteredData = result.current.applyFilters(null);
    expect(filteredData).toHaveLength(0);
  });
});





