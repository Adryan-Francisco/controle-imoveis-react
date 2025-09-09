// src/config/env.js
// Configuração de variáveis de ambiente

export const config = {
  // Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://ylfmefcvwkaxqrmugwjm.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZm1lZmN2d2theHFybXVnd2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjE5MzAsImV4cCI6MjA3MDgzNzkzMH0.uEEdwKyJccQbVof1z3dgqnEXCVySWE0DA1jr5h-s_mk'
  },
  
  // App
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Controle de Imóveis Rurais',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Sistema de controle de imóveis rurais'
  },
  
  // Feature Flags
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    offlineMode: import.meta.env.VITE_ENABLE_OFFLINE_MODE !== 'false',
    pushNotifications: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true'
  },
  
  // API
  api: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100
  },
  
  // Cache
  cache: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  }
};

// Validação de configuração obrigatória
export const validateConfig = () => {
  const errors = [];
  
  if (!config.supabase.url) {
    errors.push('VITE_SUPABASE_URL é obrigatório');
  }
  
  if (!config.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY é obrigatório');
  }
  
  if (errors.length > 0) {
    console.error('Erro de configuração:', errors);
    throw new Error(`Configuração inválida: ${errors.join(', ')}`);
  }
  
  return true;
};

