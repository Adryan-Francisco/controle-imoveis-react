// src/components/OptimizedLoadingSpinner.jsx
import React, { memo } from 'react';
import { Loader, Center, Text, Stack } from '@mantine/core';

export const OptimizedLoadingSpinner = memo(function OptimizedLoadingSpinner({ 
  size = 'md', 
  message = 'Carregando...', 
  showMessage = true,
  color = 'blue'
}) {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        <Loader size={size} color={color} />
        {showMessage && (
          <Text size="sm" c="dimmed">
            {message}
          </Text>
        )}
      </Stack>
    </Center>
  );
});

// Componente para loading de tabela
export const TableLoadingSpinner = memo(function TableLoadingSpinner() {
  return (
    <Center py="xl">
      <Stack align="center" gap="md">
        <Loader size="sm" color="blue" />
        <Text size="sm" c="dimmed">
          Carregando dados...
        </Text>
      </Stack>
    </Center>
  );
});

// Componente para loading de modal
export const ModalLoadingSpinner = memo(function ModalLoadingSpinner() {
  return (
    <Center py="lg">
      <Loader size="sm" color="blue" />
    </Center>
  );
});
