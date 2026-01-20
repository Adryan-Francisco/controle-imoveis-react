// src/components/OfflineStatus.jsx
import React from 'react';
import {
  Alert,
  Group,
  Text,
  Button,
  Progress,
  Stack,
  Badge,
  useMantineTheme
} from '@mantine/core';
import {
  IconWifi,
  IconWifiOff,
  IconRefresh,
  IconCloudUpload,
  IconClock,
  IconCheck
} from '@tabler/icons-react';
import { useAccessibility } from '../hooks/useAccessibility';

export function OfflineStatus({
  isOnline,
  isSyncing,
  pendingChanges,
  lastSync,
  onSync,
  compact = false
}) {
  const theme = useMantineTheme();
  const { announce, generateId } = useAccessibility();
  const statusId = generateId('offline-status');

  // Anunciar mudanças de status
  React.useEffect(() => {
    if (isOnline && pendingChanges > 0) {
      announce(`Sincronizando ${pendingChanges} alteração(ões)`);
    } else if (!isOnline) {
      announce('Modo offline ativado. Alterações serão sincronizadas quando a conexão for restaurada.');
    }
  }, [isOnline, pendingChanges, announce]);

  if (isOnline && pendingChanges === 0) {
    return null; // Não mostrar quando tudo está sincronizado
  }

  if (compact) {
    return (
      <Badge
        id={statusId}
        color={isOnline ? 'green' : 'red'}
        variant="light"
        leftSection={isOnline ? <IconWifi size={12} /> : <IconWifiOff size={12} />}
        aria-label={`Status: ${isOnline ? 'Online' : 'Offline'}${pendingChanges > 0 ? `, ${pendingChanges} alterações pendentes` : ''}`}
        role="status"
        aria-live="polite"
      >
        {isOnline ? 'Online' : 'Offline'}
        {pendingChanges > 0 && ` (${pendingChanges})`}
      </Badge>
    );
  }

  return (
    <Alert
      id={statusId}
      color={isOnline ? 'blue' : 'red'}
      variant="light"
      icon={isOnline ? <IconWifi size={16} /> : <IconWifiOff size={16} />}
      title={isOnline ? 'Modo Online' : 'Modo Offline'}
      role="status"
      aria-live="polite"
      aria-label={`Status de conexão: ${isOnline ? 'Online' : 'Offline'}`}
    >
      <Stack gap="sm">
        <Text size="sm">
          {isOnline ? (
            pendingChanges > 0 ? (
              `Sincronizando ${pendingChanges} alteração(ões)...`
            ) : (
              'Todos os dados estão sincronizados'
            )
          ) : (
            'Você está offline. As alterações serão sincronizadas quando a conexão for restaurada.'
          )}
        </Text>

        {isOnline && pendingChanges > 0 && (
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <IconCloudUpload size={16} />
              <Text size="xs" c="dimmed">
                Sincronizando alterações...
              </Text>
            </Group>
            <Button
              size="xs"
              variant="light"
              leftSection={<IconRefresh size={14} />}
              onClick={onSync}
              loading={isSyncing}
              aria-label="Sincronizar alterações agora"
              disabled={isSyncing}
            >
              Sincronizar Agora
            </Button>
          </Group>
        )}

        {isSyncing && (
          <Progress
            value={undefined}
            animated
            size="sm"
            color="blue"
            aria-label="Sincronização em andamento"
            role="progressbar"
            aria-live="polite"
          />
        )}

        {lastSync && (
          <Group gap="xs" align="center">
            <IconClock size={14} />
            <Text size="xs" c="dimmed">
              Última sincronização: {new Date(lastSync).toLocaleString('pt-BR')}
            </Text>
          </Group>
        )}

        {isOnline && pendingChanges === 0 && lastSync && (
          <Group gap="xs" align="center">
            <IconCheck size={14} color={theme.colors.green[6]} />
            <Text size="xs" c="green">
              Sincronização concluída
            </Text>
          </Group>
        )}
      </Stack>
    </Alert>
  );
}

