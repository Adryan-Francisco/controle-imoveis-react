// src/utils/api.js
// Utilitários para chamadas de API

import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Classe para gerenciar chamadas de API
 */
export class ApiClient {
  constructor(baseURL = '', config = {}) {
    this.baseURL = baseURL;
    this.config = {
      timeout: API_CONFIG.TIMEOUT,
      retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: API_CONFIG.RETRY_DELAY,
      ...config
    };
  }

  /**
   * Faz uma requisição HTTP
   * @param {string} endpoint - Endpoint da API
   * @param {Object} options - Opções da requisição
   * @returns {Promise} Resposta da API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const requestOptions = {
      ...this.config,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...options.headers
      }
    };

    try {
      const response = await this._makeRequest(url, requestOptions);
      return this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  /**
   * Faz a requisição com retry automático
   * @param {string} url - URL da requisição
   * @param {Object} options - Opções da requisição
   * @returns {Promise} Resposta da requisição
   */
  async _makeRequest(url, options) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        lastError = error;
        
        if (attempt < this.config.retryAttempts) {
          await this._delay(this.config.retryDelay * Math.pow(2, attempt));
        }
      }
    }
    
    throw lastError;
  }

  /**
   * Trata a resposta da API
   * @param {Response} response - Resposta da requisição
   * @returns {Promise} Dados processados
   */
  async _handleResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }

  /**
   * Trata erros da API
   * @param {Error} error - Erro ocorrido
   * @returns {Object} Erro tratado
   */
  _handleError(error) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: ERROR_MESSAGES.TIMEOUT_ERROR,
        code: 'TIMEOUT'
      };
    }

    if (error.message.includes('Failed to fetch')) {
      return {
        success: false,
        error: ERROR_MESSAGES.NETWORK_ERROR,
        code: 'NETWORK_ERROR'
      };
    }

    if (error.message.includes('HTTP 401')) {
      return {
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED,
        code: 'UNAUTHORIZED'
      };
    }

    if (error.message.includes('HTTP 404')) {
      return {
        success: false,
        error: ERROR_MESSAGES.NOT_FOUND,
        code: 'NOT_FOUND'
      };
    }

    if (error.message.includes('HTTP 5')) {
      return {
        success: false,
        error: ERROR_MESSAGES.SERVER_ERROR,
        code: 'SERVER_ERROR'
      };
    }

    return {
      success: false,
      error: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      code: 'UNKNOWN_ERROR'
    };
  }

  /**
   * Delay entre tentativas
   * @param {number} ms - Milissegundos para aguardar
   * @returns {Promise} Promise que resolve após o delay
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET request
   * @param {string} endpoint - Endpoint da API
   * @param {Object} options - Opções da requisição
   * @returns {Promise} Resposta da API
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @param {Object} options - Opções da requisição
   * @returns {Promise} Resposta da API
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - Endpoint da API
   * @param {Object} data - Dados a serem enviados
   * @param {Object} options - Opções da requisição
   * @returns {Promise} Resposta da API
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - Endpoint da API
   * @param {Object} options - Opções da requisição
   * @returns {Promise} Resposta da API
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Instância padrão do cliente API
 */
export const apiClient = new ApiClient();

/**
 * Utilitários para trabalhar com URLs
 */
export const urlUtils = {
  /**
   * Constrói uma URL com query parameters
   * @param {string} baseUrl - URL base
   * @param {Object} params - Parâmetros da query
   * @returns {string} URL construída
   */
  buildUrl(baseUrl, params = {}) {
    const url = new URL(baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  },

  /**
   * Extrai parâmetros da query string
   * @param {string} search - Query string
   * @returns {Object} Parâmetros extraídos
   */
  parseQuery(search = window.location.search) {
    const params = new URLSearchParams(search);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  }
};

/**
 * Utilitários para trabalhar com headers HTTP
 */
export const headerUtils = {
  /**
   * Cria headers de autenticação
   * @param {string} token - Token de autenticação
   * @returns {Object} Headers de autenticação
   */
  createAuthHeaders(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'X-Requested-With': 'XMLHttpRequest'
    };
  },

  /**
   * Cria headers para upload de arquivo
   * @param {string} filename - Nome do arquivo
   * @param {string} contentType - Tipo do conteúdo
   * @returns {Object} Headers para upload
   */
  createUploadHeaders(filename, contentType) {
    return {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': contentType
    };
  }
};

/**
 * Utilitários para trabalhar com cache
 */
export const cacheUtils = {
  /**
   * Armazena dados no cache
   * @param {string} key - Chave do cache
   * @param {*} data - Dados a serem armazenados
   * @param {number} ttl - Time to live em milissegundos
   */
  set(key, data, ttl = 300000) { // 5 minutos por padrão
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Erro ao armazenar no cache:', error);
    }
  },

  /**
   * Recupera dados do cache
   * @param {string} key - Chave do cache
   * @returns {*} Dados do cache ou null
   */
  get(key) {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      const now = Date.now();
      
      if (now - parsed.timestamp > parsed.ttl) {
        this.remove(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Erro ao recuperar do cache:', error);
      return null;
    }
  },

  /**
   * Remove dados do cache
   * @param {string} key - Chave do cache
   */
  remove(key) {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Erro ao remover do cache:', error);
    }
  },

  /**
   * Limpa todo o cache
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Erro ao limpar cache:', error);
    }
  }
};
