// src/components/FormattedInput.jsx
import React from 'react';
import { TextInput, NumberInput } from '@mantine/core';
import { formatCPF, formatPhone } from '../utils/validators';

export function FormattedInput({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  ...props 
}) {
  const handleChange = (event) => {
    let formattedValue = event.target.value;
    
    if (type === 'cpf') {
      formattedValue = formatCPF(formattedValue);
    } else if (type === 'phone') {
      formattedValue = formatPhone(formattedValue);
    }
    
    onChange(formattedValue);
  };

  if (type === 'number') {
    return (
      <NumberInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  return (
    <TextInput
      type={type === 'cpf' || type === 'phone' ? 'text' : type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      {...props}
    />
  );
}







