// src/hooks/useStatistics.js
import { useMemo } from 'react';

export function useStatistics(imoveis) {
  return useMemo(() => {
    const totalImoveis = imoveis.length;
    
    // Verificar diferentes possibilidades de campo de status
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
    
    const valorTotal = imoveis.reduce((sum, i) => sum + (i.valor || 0), 0);
    
    const valorPendente = imoveis
      .filter(i => {
        const status = i[statusField] || i.status_pagamento || i.status;
        return status !== 'PAGO' && status !== 'pago' && status !== 'Pago';
      })
      .reduce((sum, i) => sum + (i.valor || 0), 0);
    
    const valorRecebido = imoveis
      .filter(i => {
        const status = i[statusField] || i.status_pagamento || i.status;
        return status === 'PAGO' || status === 'pago' || status === 'Pago';
      })
      .reduce((sum, i) => sum + (i.valor || 0), 0);

    return {
      totalImoveis,
      imoveisPagos,
      imoveisPendentes,
      imoveisAtrasados,
      valorTotal,
      valorPendente,
      valorRecebido
    };
  }, [imoveis]);
}
