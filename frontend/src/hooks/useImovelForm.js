// src/hooks/useImovelForm.js
import { useForm } from '@mantine/form';
import { useCallback } from 'react';
import { useFormValidation } from './useFormValidation';
import { validateRequired, validateMinLength, validateNumber, validateCPF, validatePhone } from '../utils/validators';

export function useImovelForm(initialValues = {}) {
  const { validateForm, getError } = useFormValidation();
  
  // Garantir que initialValues não seja null ou undefined
  const safeInitialValues = initialValues || {};
  
  const form = useForm({
    initialValues: {
      id: null,
      proprietario: '',
      sitio: '',
      cpf: '',
      valor: null,
      data_vencimento: null,
      status_pagamento: 'PENDENTE',
      ccir: '',
      endereco: '',
      itr: '',
      telefone: '',
      data_pagamento: null,
      ...safeInitialValues
    },
    validate: {
      proprietario: (value) => {
        return validateRequired(value, 'Proprietário') || 
               validateMinLength(value, 2, 'Proprietário');
      },
      cpf: (value) => {
        return value ? validateCPF(value) : null;
      },
      telefone: (value) => {
        return value ? validatePhone(value) : null;
      },
      valor: (value) => {
        return validateNumber(value, 'Valor', 0);
      },
      endereco: (value) => {
        return validateMinLength(value, 5, 'Endereço');
      },
      sitio: (value) => {
        return validateMinLength(value, 2, 'Sítio/Fazenda');
      }
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
  }, [form]);

  const setFormValues = useCallback((values) => {
    if (!values) return;
    
    form.setValues({
      ...values,
      data_vencimento: values.data_vencimento ? new Date(values.data_vencimento) : null,
      data_pagamento: values.data_pagamento ? new Date(values.data_pagamento) : null,
    });
  }, [form]);

  const formatFormData = (values) => {
    const formatted = { ...values };
    
    // Clean up empty values
    if (formatted.valor === '') formatted.valor = null;
    if (formatted.data_vencimento === '') formatted.data_vencimento = null;
    if (formatted.data_pagamento === '') formatted.data_pagamento = null;
    
    return formatted;
  };

  return {
    form,
    resetForm,
    setFormValues,
    formatFormData
  };
}
