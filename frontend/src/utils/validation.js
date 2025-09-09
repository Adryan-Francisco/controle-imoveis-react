// src/utils/validation.js
// Utilitários para validação de dados

import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants';

/**
 * Valida um email
 * @param {string} email - Email a ser validado
 * @returns {Object} Resultado da validação
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return { isValid: false, error: VALIDATION_RULES.EMAIL.MESSAGE };
  }
  
  return { isValid: true };
};

/**
 * Valida uma senha
 * @param {string} password - Senha a ser validada
 * @returns {Object} Resultado da validação
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return { isValid: false, error: VALIDATION_RULES.PASSWORD.MESSAGE };
  }
  
  return { isValid: true };
};

/**
 * Valida um telefone
 * @param {string} phone - Telefone a ser validado
 * @returns {Object} Resultado da validação
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, error: 'Telefone é obrigatório' };
  }
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10 || cleaned.length > 11) {
    return { isValid: false, error: 'Telefone deve ter 10 ou 11 dígitos' };
  }
  
  return { isValid: true };
};

/**
 * Valida um valor monetário
 * @param {number} value - Valor a ser validado
 * @returns {Object} Resultado da validação
 */
export const validateCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: 'Valor é obrigatório' };
  }
  
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: 'Valor deve ser um número válido' };
  }
  
  if (numValue < VALIDATION_RULES.CURRENCY.MIN_VALUE) {
    return { isValid: false, error: VALIDATION_RULES.CURRENCY.MESSAGE };
  }
  
  return { isValid: true };
};

/**
 * Valida um CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {Object} Resultado da validação
 */
export const validateCPF = (cpf) => {
  if (!cpf) {
    return { isValid: false, error: 'CPF é obrigatório' };
  }
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) {
    return { isValid: false, error: 'CPF deve ter 11 dígitos' };
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  // Validação do algoritmo do CPF
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) {
    return { isValid: false, error: 'CPF inválido' };
  }
  
  return { isValid: true };
};

/**
 * Valida um CNPJ
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {Object} Resultado da validação
 */
export const validateCNPJ = (cnpj) => {
  if (!cnpj) {
    return { isValid: false, error: 'CNPJ é obrigatório' };
  }
  
  const cleaned = cnpj.replace(/\D/g, '');
  
  if (cleaned.length !== 14) {
    return { isValid: false, error: 'CNPJ deve ter 14 dígitos' };
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleaned)) {
    return { isValid: false, error: 'CNPJ inválido' };
  }
  
  // Validação do algoritmo do CNPJ
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleaned.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (firstDigit !== parseInt(cleaned.charAt(12))) {
    return { isValid: false, error: 'CNPJ inválido' };
  }
  
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleaned.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  if (secondDigit !== parseInt(cleaned.charAt(13))) {
    return { isValid: false, error: 'CNPJ inválido' };
  }
  
  return { isValid: true };
};

/**
 * Valida um CEP
 * @param {string} cep - CEP a ser validado
 * @returns {Object} Resultado da validação
 */
export const validateCEP = (cep) => {
  if (!cep) {
    return { isValid: false, error: 'CEP é obrigatório' };
  }
  
  const cleaned = cep.replace(/\D/g, '');
  
  if (cleaned.length !== 8) {
    return { isValid: false, error: 'CEP deve ter 8 dígitos' };
  }
  
  return { isValid: true };
};

/**
 * Valida dados de um imóvel
 * @param {Object} imovelData - Dados do imóvel
 * @returns {Object} Resultado da validação
 */
export const validateImovelData = (imovelData) => {
  const errors = {};
  
  // Validar proprietário
  if (!imovelData.proprietario || imovelData.proprietario.trim() === '') {
    errors.proprietario = 'Nome do proprietário é obrigatório';
  }
  
  // Validar sítio
  if (!imovelData.sitio || imovelData.sitio.trim() === '') {
    errors.sitio = 'Nome do sítio é obrigatório';
  }
  
  // Validar telefone
  const phoneValidation = validatePhone(imovelData.telefone);
  if (!phoneValidation.isValid) {
    errors.telefone = phoneValidation.error;
  }
  
  // Validar valor (opcional, mas se fornecido deve ser válido)
  if (imovelData.valor !== null && imovelData.valor !== undefined && imovelData.valor !== '') {
    const currencyValidation = validateCurrency(imovelData.valor);
    if (!currencyValidation.isValid) {
      errors.valor = currencyValidation.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida dados de login
 * @param {Object} loginData - Dados de login
 * @returns {Object} Resultado da validação
 */
export const validateLoginData = (loginData) => {
  const errors = {};
  
  // Validar email
  const emailValidation = validateEmail(loginData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  // Validar senha
  const passwordValidation = validatePassword(loginData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Sanitiza dados de entrada
 * @param {string} input - Dados a serem sanitizados
 * @returns {string} Dados sanitizados
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres HTML básicos
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

/**
 * Valida se uma string não está vazia
 * @param {string} value - Valor a ser validado
 * @param {string} fieldName - Nome do campo
 * @returns {Object} Resultado da validação
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return { isValid: false, error: `${fieldName} é obrigatório` };
  }
  
  return { isValid: true };
};

/**
 * Valida se um valor está dentro de um range
 * @param {number} value - Valor a ser validado
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @param {string} fieldName - Nome do campo
 * @returns {Object} Resultado da validação
 */
export const validateRange = (value, min, max, fieldName) => {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} deve ser um número válido` };
  }
  
  if (numValue < min || numValue > max) {
    return { isValid: false, error: `${fieldName} deve estar entre ${min} e ${max}` };
  }
  
  return { isValid: true };
};
