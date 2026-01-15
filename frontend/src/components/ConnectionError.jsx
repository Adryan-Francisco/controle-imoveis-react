// src/components/ConnectionError.jsx
import React from 'react';
import {
  Alert,
  Button,
  Stack,
  Text,
  Group,
  ActionIcon
} from '@mantine/core';
import {
  IconAlertCircle,
  IconRefresh,
  IconWifi,
  IconWifiOff
} from '@tabler/icons-react';

export function ConnectionError({ 
  error, 
  onRetry, 
  isRetrying = false,
  showRetryButton = true 
}) {
  const isNetworkError = error?.message?.includes('Failed to fetch') || 
                        error?.message?.includes('CORS') ||
                        error?.message?.includes('network');

  const isAuthError = error?.message?.includes('JWT') || 
                     error?.message?.includes('token') ||
                     error?.message?.includes('403');

  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Erro de Conexão"
      color="red"
      variant="light"
    >
      <Stack gap="md">
        <Text size="sm">
          {isNetworkError && (
            <>
              <IconWifiOff size={16} style={{ marginRight: 8 }} />
              Problema de conexão com o servidor. Verifique sua internet e tente novamente.
            </>
          )}
          {isAuthError && (
            <>
              <IconWifi size={16} style={{ marginRight: 8 }} />
              Erro de autenticação. Sua sessão pode ter expirado.
            </>
          )}
          {!isNetworkError && !isAuthError && (
            <>
              Ocorreu um erro inesperado. Tente novamente em alguns instantes.
            </>
          )}
        </Text>

        {error?.message && (
          <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
            {error.message}
          </Text>
        )}

        {showRetryButton && (
          <Group justify="flex-end">
            <Button
              variant="light"
              size="sm"
              leftSection={<IconRefresh size={16} />}
              onClick={onRetry}
              loading={isRetrying}
            >
              {isRetrying ? 'Tentando...' : 'Tentar Novamente'}
            </Button>
          </Group>
        )}
      </Stack>
    </Alert>
  );
}





