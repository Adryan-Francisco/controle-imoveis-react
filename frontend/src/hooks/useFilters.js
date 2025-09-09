// src/hooks/useFilters.js
import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: null,
    dateTo: null,
    valorMin: null,
    valorMax: null,
    ...initialFilters
  });

  // Debounce para busca em tempo real
  const debouncedSearch = useDebounce(filters.search, 300);

  // Aplicar filtros aos dados
  const applyFilters = useCallback((data) => {
    if (!data || data.length === 0) return data;

    return data.filter(item => {
      // Filtro de busca (nome do proprietário, sítio, endereço)
      if (debouncedSearch) {
        const searchTerm = debouncedSearch.toLowerCase();
        const searchableFields = [
          item.proprietario,
          item.sitio,
          item.endereco,
          item.cpf,
          item.telefone
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableFields.includes(searchTerm)) {
          return false;
        }
      }

      // Filtro por status
      if (filters.status && item.status_pagamento !== filters.status) {
        return false;
      }

      // Filtro por data de vencimento
      if (filters.dateFrom && item.data_vencimento) {
        const itemDate = new Date(item.data_vencimento);
        const fromDate = new Date(filters.dateFrom);
        if (itemDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo && item.data_vencimento) {
        const itemDate = new Date(item.data_vencimento);
        const toDate = new Date(filters.dateTo);
        if (itemDate > toDate) {
          return false;
        }
      }

      // Filtro por valor
      if (filters.valorMin !== null && item.valor < filters.valorMin) {
        return false;
      }

      if (filters.valorMax !== null && item.valor > filters.valorMax) {
        return false;
      }

      return true;
    });
  }, [debouncedSearch, filters]);

  // Atualizar filtro específico
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Atualizar múltiplos filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Limpar todos os filtros
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      dateFrom: null,
      dateTo: null,
      valorMin: null,
      valorMax: null,
    });
  }, []);

  // Limpar filtro específico
  const clearFilter = useCallback((key) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'search' ? '' : null
    }));
  }, []);

  // Verificar se há filtros ativos
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => 
      value !== '' && value !== null && value !== undefined
    );
  }, [filters]);

  // Contar filtros ativos
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
  }, [filters]);

  // Obter filtros ativos para exibição
  const activeFilters = useMemo(() => {
    const active = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        active[key] = value;
      }
    });
    return active;
  }, [filters]);

  return {
    filters,
    debouncedSearch,
    applyFilters,
    updateFilter,
    updateFilters,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    activeFiltersCount,
    activeFilters,
  };
}

