// src/components/StatusBadge.jsx
import React from 'react';
import { Badge, Group, Text, ThemeIcon } from '@mantine/core';
import { IconCheck, IconClock, IconAlertTriangle, IconX } from '@tabler/icons-react';

export function StatusBadge({ status, size = 'md', variant = 'filled' }) {
  const statusConfig = {
    PAGO: {
      color: 'green',
      icon: IconCheck,
      label: '✓ Pago',
      emoji: '✅'
    },
    PENDENTE: {
      color: 'yellow',
      icon: IconClock,
      label: '⏱️ Pendente',
      emoji: '⏳'
    },
    ATRASADO: {
      color: 'red',
      icon: IconAlertTriangle,
      label: '⚠️ Atrasado',
      emoji: '🚨'
    },
    CANCELADO: {
      color: 'gray',
      icon: IconX,
      label: '✗ Cancelado',
      emoji: '❌'
    },
    ATIVO: {
      color: 'green',
      icon: IconCheck,
      label: 'Ativo',
      emoji: '🟢'
    },
    INATIVO: {
      color: 'gray',
      icon: IconX,
      label: 'Inativo',
      emoji: '⭕'
    }
  };

  const config = statusConfig[status?.toUpperCase()] || statusConfig.PENDENTE;

  return (
    <Badge
      size={size}
      variant={variant}
      color={config.color}
      leftSection={<config.icon size={14} />}
      radius="md"
      className="status-badge"
      style={{
        fontWeight: 600,
        textTransform: 'none'
      }}
    >
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
