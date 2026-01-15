// src/components/PWAUpdatePrompt.jsx
import React from 'react';
import { Card, Group, Text, Button, useMantineTheme } from '@mantine/core';
import { IconRefresh, IconX } from '@tabler/icons-react';

export function PWAUpdatePrompt({ onUpdate, onDismiss }) {
  const theme = useMantineTheme();

  return (
    <Card
      withBorder
      p="md"
      radius="md"
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 1000,
        background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
        boxShadow: theme.shadows.lg,
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={600} mb="xs">
            Atualização Disponível
          </Text>
          <Text size="xs" c="dimmed">
            Uma nova versão do app está disponível. Atualize para ter acesso às últimas funcionalidades.
          </Text>
        </div>
        <Group spacing="xs">
          <Button
            size="xs"
            leftSection={<IconRefresh size={14} />}
            onClick={onUpdate}
            style={{ background: theme.colors.green[6] }}
          >
            Atualizar
          </Button>
          <Button
            size="xs"
            variant="subtle"
            color="gray"
            onClick={onDismiss}
            leftSection={<IconX size={14} />}
          >
            Depois
          </Button>
        </Group>
      </Group>
    </Card>
  );
}







