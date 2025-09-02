// src/components/AccessibleButton.jsx
import React from 'react';
import { Button } from '@mantine/core';

export function AccessibleButton({ 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  variant = 'filled',
  color = 'blue',
  size = 'md',
  radius = 'md',
  leftSection,
  rightSection,
  fullWidth = false,
  ariaLabel,
  ariaDescribedBy,
  ...props 
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      loading={loading}
      variant={variant}
      color={color}
      size={size}
      radius={radius}
      leftSection={leftSection}
      rightSection={rightSection}
      fullWidth={fullWidth}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role="button"
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </Button>
  );
}

