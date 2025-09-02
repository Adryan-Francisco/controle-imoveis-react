// src/hooks/useChartsData.js
import { useMemo } from 'react';
import { useMantineTheme } from '@mantine/core';

export function useChartsData(imoveis) {
  const theme = useMantineTheme();

  const statusData = useMemo(() => {
    const imoveisPagos = imoveis.filter(i => i.status_pagamento === 'PAGO').length;
    const imoveisPendentes = imoveis.filter(i => i.status_pagamento === 'PENDENTE').length;
    const imoveisAtrasados = imoveis.filter(i => i.status_pagamento === 'ATRASADO').length;

    return [
      { name: 'Pagos', value: imoveisPagos, color: theme.colors.green[6] },
      { name: 'Pendentes', value: imoveisPendentes, color: theme.colors.orange[6] },
      { name: 'Atrasados', value: imoveisAtrasados, color: theme.colors.red[6] },
    ];
  }, [imoveis, theme.colors]);

  const monthlyData = useMemo(() => {
    const monthlyCount = imoveis
      .filter(i => i.data_vencimento)
      .reduce((acc, i) => {
        const month = new Date(i.data_vencimento).toLocaleDateString('pt-BR', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(monthlyCount).map(([month, count]) => ({
      month,
      count,
    }));
  }, [imoveis]);

  return {
    statusData,
    monthlyData
  };
}

