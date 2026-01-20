// src/hooks/useSecurityValidation.js
import { useCallback } from 'react';
import { validateCPF, validatePhone } from '../utils/validators';

export function useSecurityValidation() {
  // Sanitizar dados de entrada
  const sanitizeInput = useCallback((input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }, []);

  // Validar dados do imóvel
  const validateImovelData = useCallback((data) => {
    const errors = {};
    
    // Validar campos obrigatórios
    if (!data.proprietario || data.proprietario.trim().length === 0) {
      errors.proprietario = 'Nome do proprietário é obrigatório';
    }
    
    // Validar CPF se fornecido
    if (data.cpf) {
      const cpfError = validateCPF(data.cpf);
      if (cpfError) {
        errors.cpf = cpfError;
      }
    }
    
    // Validar telefone se fornecido
    if (data.telefone) {
      const phoneError = validatePhone(data.telefone);
      if (phoneError) {
        errors.telefone = phoneError;
      }
    }
    
    // Validar valor se fornecido
    if (data.valor !== null && data.valor !== undefined) {
      if (typeof data.valor !== 'number' || data.valor < 0) {
        errors.valor = 'Valor deve ser um número positivo';
      }
    }
    
    // Validar datas
    if (data.data_vencimento) {
      const date = new Date(data.data_vencimento);
      if (isNaN(date.getTime())) {
        errors.data_vencimento = 'Data de vencimento inválida';
      }
    }
    
    if (data.data_pagamento) {
      const date = new Date(data.data_pagamento);
      if (isNaN(date.getTime())) {
        errors.data_pagamento = 'Data de pagamento inválida';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Sanitizar dados do imóvel
  const sanitizeImovelData = useCallback((data) => {
    const sanitized = {};
    
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        sanitized[key] = sanitizeInput(data[key]);
      } else {
        sanitized[key] = data[key];
      }
    });
    
    return sanitized;
  }, [sanitizeInput]);

  // Validar permissões do usuário
  const validateUserPermissions = useCallback((user) => {
    if (!user || !user.id) {
      return { allowed: false, error: 'Usuário não autenticado' };
    }
    
    // Aqui você pode implementar lógica de permissões mais complexa
    
    return { allowed: true };
  }, []);

  // Rate limiting simples (baseado em localStorage)
  const checkRateLimit = useCallback((action, maxAttempts = 10, windowMs = 60000) => {
    const now = Date.now();
    const key = `rate_limit_${action}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Remove tentativas antigas
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return { allowed: false, error: 'Muitas tentativas. Tente novamente em alguns minutos.' };
    }
    
    // Adiciona nova tentativa
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return { allowed: true };
  }, []);

  return {
    sanitizeInput,
    validateImovelData,
    sanitizeImovelData,
    validateUserPermissions,
    checkRateLimit
  };
}
