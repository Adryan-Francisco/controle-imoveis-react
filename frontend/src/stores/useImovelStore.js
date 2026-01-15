// src/stores/useImovelStore.js
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useImovelStore = create(
  subscribeWithSelector((set, get) => ({
    // State
    imoveis: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      valorMin: null,
      valorMax: null
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0
    },
    selectedImovel: null,
    isEditing: false,
    isCreating: false,
    
    // Actions
    setImoveis: (imoveis) => set({ imoveis }),
    
    setLoading: (loading) => set({ loading }),
    
    setError: (error) => set({ error }),
    
    setFilters: (filters) => set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, currentPage: 1 } // Reset to first page when filtering
    })),
    
    clearFilters: () => set({
      filters: {
        search: '',
        status: '',
        dateFrom: null,
        dateTo: null,
        valorMin: null,
        valorMax: null
      },
      pagination: { ...get().pagination, currentPage: 1 }
    }),
    
    setPagination: (pagination) => set((state) => ({
      pagination: { ...state.pagination, ...pagination }
    })),
    
    setCurrentPage: (page) => set((state) => ({
      pagination: { ...state.pagination, currentPage: page }
    })),
    
    setPageSize: (size) => set((state) => ({
      pagination: { 
        ...state.pagination, 
        pageSize: size, 
        currentPage: 1 
      }
    })),
    
    setSelectedImovel: (imovel) => set({ selectedImovel: imovel }),
    
    setIsEditing: (editing) => set({ isEditing: editing }),
    
    setIsCreating: (creating) => set({ isCreating: creating }),
    
    // Computed values
    getFilteredImoveis: () => {
      const { imoveis, filters } = get();
      
      return imoveis.filter(imovel => {
        // Search filter
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const searchableFields = [
            imovel.proprietario,
            imovel.sitio,
            imovel.endereco,
            imovel.cpf,
            imovel.telefone
          ].filter(Boolean).join(' ').toLowerCase();
          
          if (!searchableFields.includes(searchTerm)) {
            return false;
          }
        }
        
        // Status filter
        if (filters.status && imovel.status_pagamento !== filters.status) {
          return false;
        }
        
        // Date filters
        if (filters.dateFrom && imovel.data_vencimento) {
          const itemDate = new Date(imovel.data_vencimento);
          const fromDate = new Date(filters.dateFrom);
          if (itemDate < fromDate) {
            return false;
          }
        }
        
        if (filters.dateTo && imovel.data_vencimento) {
          const itemDate = new Date(imovel.data_vencimento);
          const toDate = new Date(filters.dateTo);
          if (itemDate > toDate) {
            return false;
          }
        }
        
        // Value filters
        if (filters.valorMin !== null && (imovel.valor || 0) < filters.valorMin) {
          return false;
        }
        
        if (filters.valorMax !== null && (imovel.valor || 0) > filters.valorMax) {
          return false;
        }
        
        return true;
      });
    },
    
    getActiveFiltersCount: () => {
      const { filters } = get();
      return Object.values(filters).filter(value => 
        value !== '' && value !== null && value !== undefined
      ).length;
    },
    
    hasActiveFilters: () => {
      return get().getActiveFiltersCount() > 0;
    },
    
    // Reset store
    reset: () => set({
      imoveis: [],
      loading: false,
      error: null,
      filters: {
        search: '',
        status: '',
        dateFrom: null,
        dateTo: null,
        valorMin: null,
        valorMax: null
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0
      },
      selectedImovel: null,
      isEditing: false,
      isCreating: false
    })
  }))
);





