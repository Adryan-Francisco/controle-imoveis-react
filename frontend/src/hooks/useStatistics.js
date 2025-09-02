// src/hooks/useStatistics.js
import { useMemo } from 'react';

export function useStatistics(imoveis) {
  return useMemo(() => {
    const totalImoveis = imoveis.length;
    const imoveisPagos = imoveis.filter(i => i.status_pagamento === 'PAGO').length;
    const imoveisPendentes = imoveis.filter(i => i.status_pagamento === 'PENDENTE').length;
    const imoveisAtrasados = imoveis.filter(i => i.status_pagamento === 'ATRASADO').length;
    
    const valorTotal = imoveis.reduce((sum, i) => sum + (i.valor || 0), 0);
    const valorPendente = imoveis
      .filter(i => i.status_pagamento !== 'PAGO')
      .reduce((sum, i) => sum + (i.valor || 0), 0);
    
    const valorRecebido = imoveis
      .filter(i => i.status_pagamento === 'PAGO')
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
