// src/utils/validators.js

// CPF validation
export function validateCPF(cpf) {
  if (!cpf) return null;
  
  // Remove non-numeric characters
  cpf = cpf.replace(/[^\d]/g, '');
  
  // Check if it has 11 digits
  if (cpf.length !== 11) {
    return 'CPF deve ter 11 dígitos';
  }
  
  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(cpf)) {
    return 'CPF inválido';
  }
  
  // Validate CPF algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) {
    return 'CPF inválido';
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) {
    return 'CPF inválido';
  }
  
  return null;
}

// Phone validation
export function validatePhone(phone) {
  if (!phone) return null;
  
  // Remove non-numeric characters
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // Check if it has 10 or 11 digits
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return 'Telefone deve ter 10 ou 11 dígitos';
  }
  
  // Check if it starts with valid area code
  const areaCode = cleanPhone.substring(0, 2);
  if (parseInt(areaCode) < 11 || parseInt(areaCode) > 99) {
    return 'Código de área inválido';
  }
  
  return null;
}

// Email validation
export function validateEmail(email) {
  if (!email) return null;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  
  return null;
}

// Required field validation
export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return `${fieldName} é obrigatório`;
  }
  return null;
}

// Min length validation
export function validateMinLength(value, minLength, fieldName) {
  if (value && value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
  }
  return null;
}

// Max length validation
export function validateMaxLength(value, maxLength, fieldName) {
  if (value && value.length > maxLength) {
    return `${fieldName} deve ter no máximo ${maxLength} caracteres`;
  }
  return null;
}

// Number validation
export function validateNumber(value, fieldName, min = null, max = null) {
  if (value === null || value === undefined || value === '') return null;
  
  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} deve ser um número válido`;
  }
  
  if (min !== null && num < min) {
    return `${fieldName} deve ser maior ou igual a ${min}`;
  }
  
  if (max !== null && num > max) {
    return `${fieldName} deve ser menor ou igual a ${max}`;
  }
  
  return null;
}

// Date validation
export function validateDate(date, fieldName) {
  if (!date) return null;
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} deve ser uma data válida`;
  }
  
  return null;
}

// Future date validation
export function validateFutureDate(date, fieldName) {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return `${fieldName} deve ser uma data futura`;
  }
  
  return null;
}

// Past date validation
export function validatePastDate(date, fieldName) {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (dateObj > today) {
    return `${fieldName} deve ser uma data passada`;
  }
  
  return null;
}

// Format CPF
export function formatCPF(value) {
  if (!value) return '';
  
  const cleanValue = value.replace(/[^\d]/g, '');
  return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Format phone
export function formatPhone(value) {
  if (!value) return '';
  
  const cleanValue = value.replace(/[^\d]/g, '');
  
  if (cleanValue.length <= 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return cleanValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
}

// Format currency
export function formatCurrency(value) {
  if (!value) return '';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

