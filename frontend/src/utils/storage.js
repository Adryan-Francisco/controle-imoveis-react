// src/utils/storage.js
// Utilitários para gerenciamento de storage local

import { STORAGE_KEYS } from '../constants';

/**
 * Classe para gerenciar storage local
 */
export class StorageManager {
  constructor() {
    this.isAvailable = this._checkAvailability();
  }

  /**
   * Verifica se o localStorage está disponível
   * @returns {boolean} True se disponível
   */
  _checkAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Armazena dados no localStorage
   * @param {string} key - Chave para armazenar
   * @param {*} data - Dados a serem armazenados
   * @returns {boolean} True se armazenado com sucesso
   */
  set(key, data) {
    if (!this.isAvailable) {
      console.warn('localStorage não está disponível');
      return false;
    }

    try {
      const serialized = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0.0'
      });
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Erro ao armazenar dados:', error);
      return false;
    }
  }

  /**
   * Recupera dados do localStorage
   * @param {string} key - Chave dos dados
   * @param {*} defaultValue - Valor padrão se não encontrar
   * @returns {*} Dados recuperados ou valor padrão
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Erro ao recuperar dados:', error);
      return defaultValue;
    }
  }

  /**
   * Remove dados do localStorage
   * @param {string} key - Chave dos dados
   * @returns {boolean} True se removido com sucesso
   */
  remove(key) {
    if (!this.isAvailable) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover dados:', error);
      return false;
    }
  }

  /**
   * Limpa todo o localStorage
   * @returns {boolean} True se limpo com sucesso
   */
  clear() {
    if (!this.isAvailable) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }

  /**
   * Verifica se uma chave existe
   * @param {string} key - Chave a verificar
   * @returns {boolean} True se existe
   */
  has(key) {
    if (!this.isAvailable) return false;
    return localStorage.getItem(key) !== null;
  }

  /**
   * Retorna todas as chaves armazenadas
   * @returns {string[]} Array de chaves
   */
  keys() {
    if (!this.isAvailable) return [];
    
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Erro ao listar chaves:', error);
      return [];
    }
  }

  /**
   * Retorna o tamanho usado pelo localStorage
   * @returns {number} Tamanho em bytes
   */
  size() {
    if (!this.isAvailable) return 0;

    try {
      let total = 0;
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Erro ao calcular tamanho:', error);
      return 0;
    }
  }
}

/**
 * Instância padrão do gerenciador de storage
 */
export const storage = new StorageManager();

/**
 * Utilitários específicos para dados offline
 */
export const offlineStorage = {
  /**
   * Armazena dados offline
   * @param {string} key - Chave dos dados
   * @param {*} data - Dados a serem armazenados
   * @returns {boolean} True se armazenado com sucesso
   */
  set(key, data) {
    return storage.set(`${STORAGE_KEYS.OFFLINE_DATA}_${key}`, data);
  },

  /**
   * Recupera dados offline
   * @param {string} key - Chave dos dados
   * @param {*} defaultValue - Valor padrão
   * @returns {*} Dados recuperados
   */
  get(key, defaultValue = null) {
    return storage.get(`${STORAGE_KEYS.OFFLINE_DATA}_${key}`, defaultValue);
  },

  /**
   * Remove dados offline
   * @param {string} key - Chave dos dados
   * @returns {boolean} True se removido com sucesso
   */
  remove(key) {
    return storage.remove(`${STORAGE_KEYS.OFFLINE_DATA}_${key}`);
  },

  /**
   * Lista todas as chaves offline
   * @returns {string[]} Array de chaves
   */
  keys() {
    return storage.keys().filter(key => key.startsWith(STORAGE_KEYS.OFFLINE_DATA));
  },

  /**
   * Limpa todos os dados offline
   * @returns {boolean} True se limpo com sucesso
   */
  clear() {
    const offlineKeys = this.keys();
    let success = true;
    
    offlineKeys.forEach(key => {
      if (!storage.remove(key)) {
        success = false;
      }
    });
    
    return success;
  }
};

/**
 * Utilitários para preferências do usuário
 */
export const userPreferences = {
  /**
   * Armazena preferência do usuário
   * @param {string} key - Chave da preferência
   * @param {*} value - Valor da preferência
   * @returns {boolean} True se armazenado com sucesso
   */
  set(key, value) {
    return storage.set(`${STORAGE_KEYS.USER_PREFERENCES}_${key}`, value);
  },

  /**
   * Recupera preferência do usuário
   * @param {string} key - Chave da preferência
   * @param {*} defaultValue - Valor padrão
   * @returns {*} Preferência recuperada
   */
  get(key, defaultValue = null) {
    return storage.get(`${STORAGE_KEYS.USER_PREFERENCES}_${key}`, defaultValue);
  },

  /**
   * Remove preferência do usuário
   * @param {string} key - Chave da preferência
   * @returns {boolean} True se removido com sucesso
   */
  remove(key) {
    return storage.remove(`${STORAGE_KEYS.USER_PREFERENCES}_${key}`);
  },

  /**
   * Armazena tema do usuário
   * @param {string} theme - Tema ('light' ou 'dark')
   * @returns {boolean} True se armazenado com sucesso
   */
  setTheme(theme) {
    return this.set(STORAGE_KEYS.THEME, theme);
  },

  /**
   * Recupera tema do usuário
   * @returns {string} Tema atual
   */
  getTheme() {
    return this.get(STORAGE_KEYS.THEME, 'light');
  },

  /**
   * Armazena idioma do usuário
   * @param {string} language - Idioma
   * @returns {boolean} True se armazenado com sucesso
   */
  setLanguage(language) {
    return this.set(STORAGE_KEYS.LANGUAGE, language);
  },

  /**
   * Recupera idioma do usuário
   * @returns {string} Idioma atual
   */
  getLanguage() {
    return this.get(STORAGE_KEYS.LANGUAGE, 'pt-BR');
  }
};

/**
 * Utilitários para cache de dados
 */
export const dataCache = {
  /**
   * Armazena dados no cache
   * @param {string} key - Chave do cache
   * @param {*} data - Dados a serem armazenados
   * @param {number} ttl - Time to live em milissegundos
   * @returns {boolean} True se armazenado com sucesso
   */
  set(key, data, ttl = 300000) { // 5 minutos por padrão
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    return storage.set(`cache_${key}`, cacheData);
  },

  /**
   * Recupera dados do cache
   * @param {string} key - Chave do cache
   * @param {*} defaultValue - Valor padrão
   * @returns {*} Dados do cache ou valor padrão
   */
  get(key, defaultValue = null) {
    const cached = storage.get(`cache_${key}`);
    
    if (!cached) return defaultValue;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.remove(key);
      return defaultValue;
    }
    
    return cached.data;
  },

  /**
   * Remove dados do cache
   * @param {string} key - Chave do cache
   * @returns {boolean} True se removido com sucesso
   */
  remove(key) {
    return storage.remove(`cache_${key}`);
  },

  /**
   * Verifica se dados estão no cache e válidos
   * @param {string} key - Chave do cache
   * @returns {boolean} True se válido
   */
  isValid(key) {
    const cached = storage.get(`cache_${key}`);
    
    if (!cached) return false;
    
    const now = Date.now();
    return now - cached.timestamp <= cached.ttl;
  },

  /**
   * Limpa todo o cache
   * @returns {boolean} True se limpo com sucesso
   */
  clear() {
    const keys = storage.keys().filter(key => key.startsWith('cache_'));
    let success = true;
    
    keys.forEach(key => {
      if (!storage.remove(key)) {
        success = false;
      }
    });
    
    return success;
  }
};
