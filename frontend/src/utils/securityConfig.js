// src/utils/securityConfig.js
// Configurações de segurança para o Supabase

export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMITS: {
    CREATE_IMOVEL: { max: 5, window: 60000 }, // 5 por minuto
    UPDATE_IMOVEL: { max: 10, window: 60000 }, // 10 por minuto
    DELETE_IMOVEL: { max: 3, window: 60000 }, // 3 por minuto
    LOGIN: { max: 5, window: 300000 }, // 5 por 5 minutos
  },
  
  // Validação de dados
  VALIDATION: {
    MAX_STRING_LENGTH: 255,
    MIN_PASSWORD_LENGTH: 8,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Sanitização
  SANITIZATION: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    MAX_INPUT_LENGTH: 1000,
  },
  
  // Sessão
  SESSION: {
    TIMEOUT: 30 * 60 * 1000, // 30 minutos
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutos
  }
};

// Função para validar entrada de dados
export function validateInput(input, type = 'string') {
  if (!input) return { valid: true, value: input };
  
  const config = SECURITY_CONFIG.VALIDATION;
  
  switch (type) {
    case 'string':
      if (typeof input !== 'string') return { valid: false, error: 'Deve ser uma string' };
      if (input.length > config.MAX_STRING_LENGTH) {
        return { valid: false, error: `Máximo ${config.MAX_STRING_LENGTH} caracteres` };
      }
      break;
      
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        return { valid: false, error: 'Email inválido' };
      }
      break;
      
    case 'password':
      if (input.length < config.MIN_PASSWORD_LENGTH) {
        return { valid: false, error: `Mínimo ${config.MIN_PASSWORD_LENGTH} caracteres` };
      }
      break;
  }
  
  return { valid: true, value: input };
}

// Função para sanitizar HTML
export function sanitizeHTML(html) {
  if (typeof html !== 'string') return html;
  
  const config = SECURITY_CONFIG.SANITIZATION;
  
  // Remove tags não permitidas
  const allowedTags = config.ALLOWED_TAGS.join('|');
  const regex = new RegExp(`<(?!\/?(?:${allowedTags})\\b)[^>]*>`, 'gi');
  
  return html
    .replace(regex, '')
    .substring(0, config.MAX_INPUT_LENGTH);
}

// Função para verificar rate limit
export function checkRateLimit(action, attempts, windowMs) {
  const key = `rate_limit_${action}`;
  const now = Date.now();
  const stored = JSON.parse(localStorage.getItem(key) || '[]');
  
  // Remove tentativas antigas
  const recent = stored.filter(time => now - time < windowMs);
  
  if (recent.length >= attempts) {
    return { allowed: false, error: 'Muitas tentativas. Tente novamente mais tarde.' };
  }
  
  // Adiciona nova tentativa
  recent.push(now);
  localStorage.setItem(key, JSON.stringify(recent));
  
  return { allowed: true };
}
