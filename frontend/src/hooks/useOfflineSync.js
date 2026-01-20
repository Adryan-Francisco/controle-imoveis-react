// src/hooks/useOfflineSync.js
import { useState, useEffect, useCallback } from 'react';
import { useImovelStore } from '../stores/useImovelStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { supabase } from '../supabaseClient';

export function useOfflineSync(userId) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  
  const { imoveis, setImoveis, setError } = useImovelStore();
  const { addSystemNotification } = useNotificationStore();

  // Monitorar status de conexão
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addSystemNotification('Conexão Restaurada', 'Sincronizando dados...', 'success');
      syncPendingChanges();
    };

    const handleOffline = () => {
      setIsOnline(false);
      addSystemNotification('Modo Offline', 'Algumas funcionalidades podem estar limitadas', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Salvar dados offline
  const saveOfflineData = useCallback((data, type) => {
    try {
      const offlineData = {
        ...data,
        type,
        timestamp: new Date().toISOString(),
        userId
      };

      const existingData = JSON.parse(localStorage.getItem('offlineData') || '[]');
      existingData.push(offlineData);
      localStorage.setItem('offlineData', JSON.stringify(existingData));

      setPendingChanges(prev => [...prev, offlineData]);
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error);
      setError('Erro ao salvar dados offline');
    }
  }, [userId, setError]);

  // Sincronizar mudanças pendentes
  const syncPendingChanges = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    
    try {
      const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
      const userOfflineData = offlineData.filter(item => item.userId === userId);
      
      if (userOfflineData.length === 0) {
        setIsSyncing(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (const item of userOfflineData) {
        try {
          switch (item.type) {
            case 'create':
              await supabase
                .from('ControleImoveisRurais')
                .insert([item.data]);
              break;
            case 'update':
              await supabase
                .from('ControleImoveisRurais')
                .update(item.data)
                .eq('id', item.data.id);
              break;
            case 'delete':
              await supabase
                .from('ControleImoveisRurais')
                .delete()
                .eq('id', item.data.id);
              break;
            default:
              console.warn('Tipo de operação não suportado:', item.type);
          }
          successCount++;
        } catch (error) {
          console.error('Erro ao sincronizar item:', error);
          errorCount++;
        }
      }

      // Remover dados sincronizados com sucesso
      const remainingData = offlineData.filter(item => 
        item.userId !== userId || 
        userOfflineData.find(syncedItem => syncedItem.timestamp === item.timestamp) === undefined
      );
      localStorage.setItem('offlineData', JSON.stringify(remainingData));

      setPendingChanges([]);
      setLastSync(new Date().toISOString());

      if (successCount > 0) {
        addSystemNotification(
          'Sincronização Concluída', 
          `${successCount} operação(ões) sincronizada(s) com sucesso`,
          'success'
        );
      }

      if (errorCount > 0) {
        addSystemNotification(
          'Erro na Sincronização', 
          `${errorCount} operação(ões) falharam. Tente novamente mais tarde.`,
          'error'
        );
      }

    } catch (error) {
      console.error('Erro na sincronização:', error);
      setError('Erro na sincronização offline');
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, userId, setError, addSystemNotification]);

  // Carregar dados offline
  const loadOfflineData = useCallback(() => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
      const userOfflineData = offlineData.filter(item => item.userId === userId);
      
      if (userOfflineData.length > 0) {
        // Aplicar mudanças offline aos dados atuais
        let modifiedImoveis = [...imoveis];
        
        userOfflineData.forEach(item => {
          switch (item.type) {
            case 'create':
              modifiedImoveis.push(item.data);
              break;
            case 'update':
              modifiedImoveis = modifiedImoveis.map(imovel => 
                imovel.id === item.data.id ? item.data : imovel
              );
              break;
            case 'delete':
              modifiedImoveis = modifiedImoveis.filter(imovel => 
                imovel.id !== item.data.id
              );
              break;
          }
        });
        
        setImoveis(modifiedImoveis);
      }
    } catch (error) {
      console.error('Erro ao carregar dados offline:', error);
    }
  }, [imoveis, userId, setImoveis]);

  // Operações offline
  const createOffline = useCallback((data) => {
    const offlineData = {
      ...data,
      id: `offline_${Date.now()}`,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    
    saveOfflineData(offlineData, 'create');
    
    // Adicionar aos dados locais imediatamente
    setImoveis(prev => [...prev, offlineData]);
  }, [userId, saveOfflineData, setImoveis]);

  const updateOffline = useCallback((id, data) => {
    const offlineData = { ...data, id };
    saveOfflineData(offlineData, 'update');
    
    // Atualizar dados locais imediatamente
    setImoveis(prev => prev.map(imovel => 
      imovel.id === id ? { ...imovel, ...data } : imovel
    ));
  }, [saveOfflineData, setImoveis]);

  const deleteOffline = useCallback((id) => {
    const offlineData = { id };
    saveOfflineData(offlineData, 'delete');
    
    // Remover dos dados locais imediatamente
    setImoveis(prev => prev.filter(imovel => imovel.id !== id));
  }, [saveOfflineData, setImoveis]);

  // Sincronização automática
  useEffect(() => {
    if (isOnline && pendingChanges.length > 0) {
      const timer = setTimeout(() => {
        syncPendingChanges();
      }, 2000); // Aguardar 2 segundos antes de sincronizar

      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingChanges.length, syncPendingChanges]);

  // Carregar dados offline na inicialização
  useEffect(() => {
    if (!isOnline) {
      loadOfflineData();
    }
  }, [isOnline, loadOfflineData]);

  return {
    isOnline,
    isSyncing,
    pendingChanges: pendingChanges.length,
    lastSync,
    syncPendingChanges,
    createOffline,
    updateOffline,
    deleteOffline,
    loadOfflineData
  };
}





