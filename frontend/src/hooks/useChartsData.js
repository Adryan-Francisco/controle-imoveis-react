// src/hooks/useChartsData.js
import { useMemo } from 'react';
import { useMantineTheme } from '@mantine/core';

export function useChartsData(imoveis) {
  const theme = useMantineTheme();

  const statusData = useMemo(() => {
    // Encontrar o campo de status correto
    const statusField = imoveis.length > 0 ? Object.keys(imoveis[0]).find(key => 
      key.toLowerCase().includes('status') || 
      key.toLowerCase().includes('pagamento') ||
      key.toLowerCase().includes('pago')
    ) : null;
    
    const imoveisPagos = imoveis.filter(i => {
      const status = i[statusField] || i.status_pagamento || i.status;
      return status === 'PAGO' || status === 'pago' || status === 'Pago';
    }).length;
    
    const imoveisPendentes = imoveis.filter(i => {
      const status = i[statusField] || i.status_pagamento || i.status;
      return status === 'PENDENTE' || status === 'pendente' || status === 'Pendente';
    }).length;
    
    const imoveisAtrasados = imoveis.filter(i => {
      const status = i[statusField] || i.status_pagamento || i.status;
      return status === 'ATRASADO' || status === 'atrasado' || status === 'Atrasado';
    }).length;

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

