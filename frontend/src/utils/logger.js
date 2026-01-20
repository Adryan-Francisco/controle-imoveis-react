/**
 * Logger centralizado para debug, info, warns e errors
 * Suporta diferentes níveis de log e pode enviar erros críticos para monitoramento
 */

const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

const isDevelopment = import.meta.env.MODE === 'development';

const styles = {
  debug: 'color: #666; font-weight: bold;',
  info: 'color: #0284c7; font-weight: bold;',
  warn: 'color: #f59e0b; font-weight: bold;',
  error: 'color: #dc2626; font-weight: bold;',
};

class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100;
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message, data };

    // Armazenar no array (útil para enviar para serviço de monitoramento)
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Exibir no console em desenvolvimento
    if (isDevelopment) {
      const style = styles[level] || styles.info;
      console.log(`%c[${timestamp}] ${level.toUpperCase()}: ${message}`, style, data || '');
    }

    // Enviar erros críticos para monitoramento em produção
    if (level === LOG_LEVELS.ERROR && !isDevelopment) {
      this.sendToMonitoring(logEntry);
    }
  }

  debug(message, data) {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }

  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  error(message, data) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  sendToMonitoring() {
    // Implementar integração com serviço de monitoramento (Sentry, LogRocket, etc)
    // Por enquanto, apenas uma estrutura pronta para expansão
    try {
      // await fetch('/api/logs', { method: 'POST', body: JSON.stringify(logEntry) })
    } catch (err) {
      console.error('Falha ao enviar log:', err);
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
