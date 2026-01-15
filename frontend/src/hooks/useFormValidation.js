// src/hooks/useFormValidation.js
import { useState, useCallback } from 'react';
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
  validateEmail,
  validateCPF,
  validatePhone,
  validateDate,
  validateFutureDate,
  validatePastDate,
} from '../utils/validators';

export function useFormValidation() {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value, rules) => {
    for (const rule of rules) {
      let error = null;
      
      switch (rule.type) {
        case 'required':
          error = validateRequired(value, rule.message || name);
          break;
        case 'minLength':
          error = validateMinLength(value, rule.value, rule.message || name);
          break;
        case 'maxLength':
          error = validateMaxLength(value, rule.value, rule.message || name);
          break;
        case 'number':
          error = validateNumber(value, rule.message || name, rule.min, rule.max);
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'cpf':
          error = validateCPF(value);
          break;
        case 'phone':
          error = validatePhone(value);
          break;
        case 'date':
          error = validateDate(value, rule.message || name);
          break;
        case 'futureDate':
          error = validateFutureDate(value, rule.message || name);
          break;
        case 'pastDate':
          error = validatePastDate(value, rule.message || name);
          break;
        case 'custom':
          error = rule.validator(value);
          break;
        default:
          break;
      }
      
      if (error) {
        return error;
      }
    }
    
    return null;
  }, []);

  const validateForm = useCallback((data, schema) => {
    const newErrors = {};
    let isValid = true;

    for (const [fieldName, rules] of Object.entries(schema)) {
      const value = data[fieldName];
      const error = validateField(fieldName, value, rules);
      
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  const validateSingleField = useCallback((fieldName, value, rules) => {
    const error = validateField(fieldName, value, rules);
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return !error;
  }, [validateField]);

  const clearError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasError = useCallback((fieldName) => {
    return !!errors[fieldName];
  }, [errors]);

  const getError = useCallback((fieldName) => {
    return errors[fieldName] || null;
  }, [errors]);

  return {
    errors,
    validateForm,
    validateSingleField,
    clearError,
    clearAllErrors,
    hasError,
    getError,
  };
}







