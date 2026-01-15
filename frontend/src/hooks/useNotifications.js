// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useImoveisStatistics } from './useImoveisQuery';

export function useNotifications(userId) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lastNotificationCheck, setLastNotificationCheck] = useState(null);
  
  // Buscar estatísticas para notificações
  const { data: statistics } = useImoveisStatistics(userId);

  // Verificar vencimentos próximos
  const checkUpcomingPayments = useCallback((imoveis) => {
    if (!imoveis || imoveis.length === 0) return;

    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingPayments = imoveis.filter(imovel => {
      if (!imovel.data_vencimento || imovel.status_pagamento === 'PAGO') return false;
      
      const dueDate = new Date(imovel.data_vencimento);
      return dueDate >= today && dueDate <= nextWeek;
    });

    if (upcomingPayments.length > 0) {
      notifications.show({
        title: '⚠️ Pagamentos Próximos',
        message: `Você tem ${upcomingPayments.length} pagamento(s) vencendo nos próximos 7 dias`,
        color: 'orange',
        autoClose: 10000,
        withCloseButton: true,
      });
    }
  }, []);

  // Verificar pagamentos atrasados
  const checkOverduePayments = useCallback((imoveis) => {
    if (!imoveis || imoveis.length === 0) return;

    const today = new Date();
    
    const overduePayments = imoveis.filter(imovel => {
      if (!imovel.data_vencimento || imovel.status_pagamento === 'PAGO') return false;
      
      const dueDate = new Date(imovel.data_vencimento);
      return dueDate < today;
    });

    if (overduePayments.length > 0) {
      notifications.show({
        title: '🚨 Pagamentos Atrasados',
        message: `Você tem ${overduePayments.length} pagamento(s) em atraso`,
        color: 'red',
        autoClose: 15000,
        withCloseButton: true,
      });
    }
  }, []);

  // Verificar metas de pagamento
  const checkPaymentGoals = useCallback((statistics) => {
    if (!statistics) return;

    const { taxaPagamento, totalImoveis } = statistics;
    
    // Notificar se taxa de pagamento for baixa
    if (totalImoveis > 5 && taxaPagamento < 50) {
      notifications.show({
        title: '📊 Taxa de Pagamento Baixa',
        message: `Sua taxa de pagamento está em ${taxaPagamento.toFixed(1)}%. Considere revisar os pagamentos pendentes.`,
        color: 'yellow',
        autoClose: 8000,
        withCloseButton: true,
      });
    }
    
    // Parabenizar se taxa for alta
    if (totalImoveis > 5 && taxaPagamento >= 90) {
      notifications.show({
        title: '🎉 Excelente Controle!',
        message: `Parabéns! Sua taxa de pagamento está em ${taxaPagamento.toFixed(1)}%`,
        color: 'green',
        autoClose: 5000,
        withCloseButton: true,
      });
    }
  }, []);

  // Verificar se deve mostrar notificações
  const shouldShowNotifications = useCallback(() => {
    if (!notificationsEnabled) return false;
    
    const now = new Date();
    const lastCheck = lastNotificationCheck ? new Date(lastNotificationCheck) : null;
    
    // Mostrar notificação apenas uma vez por dia
    if (lastCheck && now.getTime() - lastCheck.getTime() < 24 * 60 * 60 * 1000) {
      return false;
    }
    
    return true;
  }, [notificationsEnabled, lastNotificationCheck]);

  // Executar verificações de notificação
  const runNotificationChecks = useCallback((imoveis, statistics) => {
    if (!shouldShowNotifications()) return;
    
    checkUpcomingPayments(imoveis);
    checkOverduePayments(imoveis);
    checkPaymentGoals(statistics);
    
    setLastNotificationCheck(new Date().toISOString());
  }, [shouldShowNotifications, checkUpcomingPayments, checkOverduePayments, checkPaymentGoals]);

  // Notificação de boas-vindas
  const showWelcomeNotification = useCallback(() => {
    notifications.show({
      title: '👋 Bem-vindo ao Sistema!',
      message: 'Configure suas notificações nas preferências para receber alertas importantes.',
      color: 'blue',
      autoClose: 8000,
      withCloseButton: true,
    });
  }, []);

  // Notificação de sucesso
  const showSuccessNotification = useCallback((message, title = 'Sucesso') => {
    notifications.show({
      title,
      message,
      color: 'green',
      autoClose: 3000,
      withCloseButton: true,
    });
  }, []);

  // Notificação de erro
  const showErrorNotification = useCallback((message, title = 'Erro') => {
    notifications.show({
      title,
      message,
      color: 'red',
      autoClose: 5000,
      withCloseButton: true,
    });
  }, []);

  // Notificação de aviso
  const showWarningNotification = useCallback((message, title = 'Atenção') => {
    notifications.show({
      title,
      message,
      color: 'yellow',
      autoClose: 4000,
      withCloseButton: true,
    });
  }, []);

  // Notificação de informação
  const showInfoNotification = useCallback((message, title = 'Informação') => {
    notifications.show({
      title,
      message,
      color: 'blue',
      autoClose: 3000,
      withCloseButton: true,
    });
  }, []);

  return {
    notificationsEnabled,
    setNotificationsEnabled,
    runNotificationChecks,
    showWelcomeNotification,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
  };
}





