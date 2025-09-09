// src/stores/useNotificationStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // State
      notifications: [],
      dismissedNotifications: new Set(),
      settings: {
        upcomingPayments: true,
        overduePayments: true,
        paymentGoals: true,
        systemUpdates: true,
        emailNotifications: false,
        pushNotifications: false
      },
      lastCheck: null,
      
      // Actions
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, {
          ...notification,
          id: notification.id || Date.now().toString(),
          timestamp: new Date().toISOString()
        }]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      dismissNotification: (id) => set((state) => ({
        dismissedNotifications: new Set([...state.dismissedNotifications, id])
      })),
      
      clearDismissed: () => set({ dismissedNotifications: new Set() }),
      
      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),
      
      setLastCheck: (timestamp) => set({ lastCheck: timestamp }),
      
      // Computed values
      getActiveNotifications: () => {
        const { notifications, dismissedNotifications } = get();
        return notifications.filter(n => !dismissedNotifications.has(n.id));
      },
      
      getNotificationCount: () => {
        return get().getActiveNotifications().length;
      },
      
      hasUnreadNotifications: () => {
        const { notifications, dismissedNotifications, lastCheck } = get();
        if (!lastCheck) return notifications.length > 0;
        
        const lastCheckDate = new Date(lastCheck);
        return notifications.some(n => 
          !dismissedNotifications.has(n.id) && 
          new Date(n.timestamp) > lastCheckDate
        );
      },
      
      // Notification types
      addUpcomingPaymentNotification: (count) => {
        const notification = {
          id: 'upcoming-payments',
          type: 'warning',
          title: 'Pagamentos Próximos',
          message: `${count} pagamento(s) vencendo nos próximos 7 dias`,
          priority: 'high',
          category: 'payment'
        };
        
        get().addNotification(notification);
      },
      
      addOverduePaymentNotification: (count) => {
        const notification = {
          id: 'overdue-payments',
          type: 'error',
          title: 'Pagamentos Atrasados',
          message: `${count} pagamento(s) em atraso`,
          priority: 'urgent',
          category: 'payment'
        };
        
        get().addNotification(notification);
      },
      
      addPaymentGoalNotification: (rate, isHigh) => {
        const notification = {
          id: `payment-goal-${isHigh ? 'high' : 'low'}`,
          type: isHigh ? 'success' : 'warning',
          title: isHigh ? 'Excelente Controle!' : 'Taxa de Pagamento Baixa',
          message: `Taxa de pagamento: ${rate.toFixed(1)}%`,
          priority: isHigh ? 'low' : 'medium',
          category: 'statistics'
        };
        
        get().addNotification(notification);
      },
      
      addSystemNotification: (title, message, type = 'info') => {
        const notification = {
          id: `system-${Date.now()}`,
          type,
          title,
          message,
          priority: 'low',
          category: 'system'
        };
        
        get().addNotification(notification);
      },
      
      // Cleanup old notifications (older than 7 days)
      cleanupOldNotifications: () => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        set((state) => ({
          notifications: state.notifications.filter(n => 
            new Date(n.timestamp) > sevenDaysAgo
          )
        }));
      },
      
      // Reset store
      reset: () => set({
        notifications: [],
        dismissedNotifications: new Set(),
        settings: {
          upcomingPayments: true,
          overduePayments: true,
          paymentGoals: true,
          systemUpdates: true,
          emailNotifications: false,
          pushNotifications: false
        },
        lastCheck: null
      })
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        settings: state.settings,
        lastCheck: state.lastCheck
      })
    }
  )
);

