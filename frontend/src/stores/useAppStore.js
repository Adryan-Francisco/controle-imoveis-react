// src/stores/useAppStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      // UI State
      sidebarOpen: true,
      theme: 'light',
      notificationsEnabled: true,
      compactMode: false,
      
      // User Preferences
      pageSize: 10,
      defaultFilters: {},
      lastViewedPage: 'dashboard',
      
      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      
      setCompactMode: (compact) => set({ compactMode: compact }),
      
      setPageSize: (size) => set({ pageSize: size }),
      
      setDefaultFilters: (filters) => set({ defaultFilters: filters }),
      
      setLastViewedPage: (page) => set({ lastViewedPage: page }),
      
      // Reset all preferences
      resetPreferences: () => set({
        sidebarOpen: true,
        theme: 'light',
        notificationsEnabled: true,
        compactMode: false,
        pageSize: 10,
        defaultFilters: {},
        lastViewedPage: 'dashboard'
      })
    }),
    {
      name: 'app-preferences',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        notificationsEnabled: state.notificationsEnabled,
        compactMode: state.compactMode,
        pageSize: state.pageSize,
        defaultFilters: state.defaultFilters,
        lastViewedPage: state.lastViewedPage
      })
    }
  )
);





