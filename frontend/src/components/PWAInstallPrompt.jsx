// src/components/PWAInstallPrompt.jsx
import React from 'react';
import { Card, Group, Text, Button, useMantineTheme } from '@mantine/core';
import { IconDownload, IconX } from '@tabler/icons-react';

export function PWAInstallPrompt({ onInstall, onDismiss }) {
  const theme = useMantineTheme();

  return (
    <Card
      withBorder
      p="md"
      radius="md"
      style={{
        position: 'fixed',
        bottom: 20,
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
            Instalar App
          </Text>
          <Text size="xs" c="dimmed">
            Instale este app no seu dispositivo para acesso rápido e funcionalidade offline.
          </Text>
        </div>
        <Group spacing="xs">
          <Button
            size="xs"
            leftSection={<IconDownload size={14} />}
            onClick={onInstall}
            style={{ background: theme.colors.blue[6] }}
          >
            Instalar
          </Button>
          <Button
            size="xs"
            variant="subtle"
            color="gray"
            onClick={onDismiss}
            leftSection={<IconX size={14} />}
          >
            Agora não
          </Button>
        </Group>
      </Group>
    </Card>
  );
}



