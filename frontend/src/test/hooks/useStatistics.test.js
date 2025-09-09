// src/test/hooks/useStatistics.test.js
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStatistics } from '../../hooks/useStatistics';

describe('useStatistics', () => {
  const mockImoveis = [
    { status_pagamento: 'PAGO', valor: 1000 },
    { status_pagamento: 'PAGO', valor: 2000 },
    { status_pagamento: 'PENDENTE', valor: 1500 },
    { status_pagamento: 'ATRASADO', valor: 500 },
    { status_pagamento: 'PAGO', valor: 3000 },
  ];

  it('calculates statistics correctly', () => {
    const { result } = renderHook(() => useStatistics(mockImoveis));

    expect(result.current.totalImoveis).toBe(5);
    expect(result.current.imoveisPagos).toBe(3);
    expect(result.current.imoveisPendentes).toBe(1);
    expect(result.current.imoveisAtrasados).toBe(1);
    expect(result.current.valorTotal).toBe(8000);
    expect(result.current.valorPendente).toBe(2000);
    expect(result.current.taxaPagamento).toBe(60);
  });

  it('handles empty array', () => {
    const { result } = renderHook(() => useStatistics([]));

    expect(result.current.totalImoveis).toBe(0);
    expect(result.current.imoveisPagos).toBe(0);
    expect(result.current.imoveisPendentes).toBe(0);
    expect(result.current.imoveisAtrasados).toBe(0);
    expect(result.current.valorTotal).toBe(0);
    expect(result.current.valorPendente).toBe(0);
    expect(result.current.taxaPagamento).toBe(0);
  });

  it('handles imoveis with null values', () => {
    const imoveisWithNulls = [
      { status_pagamento: 'PAGO', valor: null },
      { status_pagamento: 'PENDENTE', valor: 1000 },
    ];

    const { result } = renderHook(() => useStatistics(imoveisWithNulls));

    expect(result.current.valorTotal).toBe(1000);
    expect(result.current.valorPendente).toBe(1000);
  });
});



