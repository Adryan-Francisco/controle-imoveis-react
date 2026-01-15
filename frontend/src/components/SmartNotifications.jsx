// src/components/SmartNotifications.jsx
import React, { useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { useImoveis } from '../hooks/useImoveis';

export function SmartNotifications({ user }) {
  const { runNotificationChecks } = useNotifications(user?.id);
  const { imoveis, loading } = useImoveis(user);

  // Executar verificações quando os dados mudarem
  useEffect(() => {
    if (!loading && imoveis && imoveis.length > 0) {
      // Aguardar um pouco para garantir que os dados estão carregados
      const timer = setTimeout(() => {
        runNotificationChecks(imoveis);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [imoveis, loading, runNotificationChecks]);

  // Este componente não renderiza nada, apenas executa as verificações
  return null;
}





