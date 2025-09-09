// src/config/app.js
// Configuração centralizada da aplicação

export const APP_CONFIG = {
  // Informações básicas
  name: 'Controle de Imóveis',
  version: '1.0.0',
  description: 'Sistema de controle de imóveis rurais',
  
  // URLs e endpoints
  api: {
    baseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    timeout: 30000
  },
  
  // Configurações de UI
  ui: {
    theme: {
      primaryColor: 'blue',
      defaultColorScheme: 'light'
    },
    notifications: {
      position: 'top-right',
      duration: 5000
    }
  },
  
  // Configurações de performance
  performance: {
    debounceDelay: 300,
    cacheTimeout: 300000, // 5 minutos
    maxRetries: 3
  },
  
  // Configurações de validação
  validation: {
    password: {
      minLength: 6,
      requireSpecialChars: false
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  }
};
