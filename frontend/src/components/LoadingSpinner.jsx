// src/components/LoadingSpinner.jsx
import React from 'react';
import { Center, Loader, Text, Stack } from '@mantine/core';

export function LoadingSpinner({ 
  size = 'lg', 
  message = 'Carregando...', 
  color = 'blue',
  fullHeight = false 
}) {

  const content = (
    <Stack align="center" spacing="md">
      <Loader size={size} color={color} />
      <Text size="sm" c="dimmed" ta="center">
        {message}
      </Text>
    </Stack>
  );

  if (fullHeight) {
    return (
      <Center style={{ height: '100vh' }}>
        {content}
      </Center>
    );
  }

  return (
    <Center py="xl">
      {content}
    </Center>
  );
}

export function PageLoadingSpinner() {
  return <LoadingSpinner fullHeight message="Carregando página..." />;
}

export function TableLoadingSpinner() {
  return <LoadingSpinner size="md" message="Carregando dados..." />;
}

