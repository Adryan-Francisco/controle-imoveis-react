// src/constants/index.js
// Constantes centralizadas do sistema

export const APP_CONFIG = {
  NAME: 'Controle de Imóveis',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de controle de imóveis rurais',
  AUTHOR: 'Sistema de Controle'
};

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Email inválido'
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MESSAGE: 'Senha deve ter pelo menos 6 caracteres'
  },
  PHONE: {
    PATTERN: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    MESSAGE: 'Telefone deve estar no formato (XX) XXXXX-XXXX'
  },
  CURRENCY: {
    MIN_VALUE: 0,
    MESSAGE: 'Valor deve ser maior que zero'
  }
};

export const TABLE_CONFIG = {
  PAGE_SIZE: 10,
  SORTABLE_COLUMNS: ['proprietario', 'sitio', 'telefone', 'valor'],
  DEFAULT_SORT: 'proprietario'
};

export const NOTIFICATION_CONFIG = {
  DURATION: 5000,
  POSITION: 'top-right',
  MAX_NOTIFICATIONS: 5
};

export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: 'blue',
    SUCCESS: 'green',
    WARNING: 'orange',
    ERROR: 'red',
    INFO: 'blue'
  },
  BREAKPOINTS: {
    XS: '30em',
    SM: '48em',
    MD: '64em',
    LG: '74em',
    XL: '90em'
  }
};

export const STORAGE_KEYS = {
  OFFLINE_DATA: 'offlineData',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  IMOVEIS: '/imoveis',
  REPORTS: '/reports',
  SETTINGS: '/settings'
};

export const PERMISSIONS = {
  VIEW_IMOVEIS: 'view_imoveis',
  CREATE_IMOVEIS: 'create_imoveis',
  EDIT_IMOVEIS: 'edit_imoveis',
  DELETE_IMOVEIS: 'delete_imoveis',
  VIEW_REPORTS: 'view_reports',
  MANAGE_USERS: 'manage_users'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  TIMEOUT_ERROR: 'Tempo limite excedido. Tente novamente.',
  UNKNOWN_ERROR: 'Erro desconhecido. Contate o suporte.'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  SAVE_SUCCESS: 'Dados salvos com sucesso!',
  DELETE_SUCCESS: 'Item excluído com sucesso!',
  UPDATE_SUCCESS: 'Dados atualizados com sucesso!',
  PASSWORD_RESET: 'Email de recuperação enviado!',
  PASSWORD_UPDATED: 'Senha atualizada com sucesso!'
};
export const REGIME_TYPES = {
  SIMPLES_NACIONAL: 'simples_nacional',
  LUCRO_PRESUMIDO: 'lucro_presumido',
  LUCRO_REAL: 'lucro_real',
  MEI: 'mei',
};

export const REGIME_LABELS = {
  simples_nacional: 'Simples Nacional',
  lucro_presumido: 'Lucro Presumido',
  lucro_real: 'Lucro Real',
  mei: 'MEI',
};

export const BOLETO_STATUS = {
  PAGO: 'pago',
  PENDENTE: 'pendente',
  VENCIDO: 'vencido',
  CANCELADO: 'cancelado',
};

export const BOLETO_STATUS_LABELS = {
  pago: 'Pago',
  pendente: 'Pendente',
  vencido: 'Vencido',
  cancelado: 'Cancelado',
};

export const BOLETO_STATUS_COLORS = {
  pago: 'green',
  pendente: 'yellow',
  vencido: 'red',
  cancelado: 'gray',
};

// Performance & Caching
export const CACHE_DURATION = {
  FAST: 5 * 60 * 1000,      // 5 minutos
  NORMAL: 15 * 60 * 1000,   // 15 minutos
  LONG: 60 * 60 * 1000,     // 1 hora
};

// Debounce timeouts
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  AUTO_SAVE: 1000,
  RESIZE: 200,
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  DEFAULT_PAGE: 1,
};