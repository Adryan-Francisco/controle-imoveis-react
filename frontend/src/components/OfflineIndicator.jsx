// src/components/OfflineIndicator.jsx
import React from 'react';
import { Alert, Text, useMantineTheme } from '@mantine/core';
import { IconWifi } from '@tabler/icons-react';

export function OfflineIndicator({ isOnline }) {
  const theme = useMantineTheme();

  if (isOnline) return null;

  return (
    <Alert
      icon={<IconWifi size="1rem" />}
      title="Sem conexão"
      color="orange"
      variant="light"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        borderRadius: 0,
      }}
    >
      <Text size="sm">
        Você está offline. Algumas funcionalidades podem estar limitadas.
      </Text>
    </Alert>
  );
}
