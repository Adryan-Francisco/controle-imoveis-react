// src/components/NotificationDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Group,
  Text,
  Badge,
  Stack,
  Button,
  Alert,
  useMantineTheme,
  Divider,
  Box,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import {
  IconBell,
  IconBellOff,
  IconSettings,
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconX
} from '@tabler/icons-react';

export function NotificationDashboard({ imoveis, statistics, onSettingsClick }) {
  const theme = useMantineTheme();
  const [notifications, setNotifications] = useState([]);
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());

  // Gerar notificações baseadas nos dados
  useEffect(() => {
    if (!imoveis || !statistics) return;

    const newNotifications = [];

    // Verificar vencimentos próximos
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcomingPayments = imoveis.filter(imovel => {
      if (!imovel.data_vencimento || imovel.status_pagamento === 'PAGO') return false;
      const dueDate = new Date(imovel.data_vencimento);
      return dueDate >= today && dueDate <= nextWeek;
    });

    if (upcomingPayments.length > 0) {
      newNotifications.push({
        id: 'upcoming-payments',
        type: 'warning',
        title: 'Pagamentos Próximos',
        message: `${upcomingPayments.length} pagamento(s) vencendo nos próximos 7 dias`,
        icon: IconClock,
        color: 'orange',
        count: upcomingPayments.length
      });
    }

    // Verificar pagamentos atrasados
    const overduePayments = imoveis.filter(imovel => {
      if (!imovel.data_vencimento || imovel.status_pagamento === 'PAGO') return false;
      const dueDate = new Date(imovel.data_vencimento);
      return dueDate < today;
    });

    if (overduePayments.length > 0) {
      newNotifications.push({
        id: 'overdue-payments',
        type: 'error',
        title: 'Pagamentos Atrasados',
        message: `${overduePayments.length} pagamento(s) em atraso`,
        icon: IconAlertTriangle,
        color: 'red',
        count: overduePayments.length
      });
    }

    // Verificar taxa de pagamento
    if (statistics.totalImoveis > 5) {
      if (statistics.taxaPagamento < 50) {
        newNotifications.push({
          id: 'low-payment-rate',
          type: 'warning',
          title: 'Taxa de Pagamento Baixa',
          message: `Taxa atual: ${statistics.taxaPagamento.toFixed(1)}%`,
          icon: IconAlertTriangle,
          color: 'yellow'
        });
      } else if (statistics.taxaPagamento >= 90) {
        newNotifications.push({
          id: 'high-payment-rate',
          type: 'success',
          title: 'Excelente Controle!',
          message: `Taxa de pagamento: ${statistics.taxaPagamento.toFixed(1)}%`,
          icon: IconCheck,
          color: 'green'
        });
      }
    }

    setNotifications(newNotifications);
  }, [imoveis, statistics]);

  const dismissNotification = (id) => {
    setDismissedNotifications(prev => new Set([...prev, id]));
  };

  const activeNotifications = notifications.filter(
    notification => !dismissedNotifications.has(notification.id)
  );

  if (activeNotifications.length === 0) {
    return (
      <Paper p="md" withBorder>
        <Group justify="space-between" align="center">
          <Group>
            <IconCheck size={20} color={theme.colors.green[6]} />
            <Text fw={500} c="green">
              Tudo em dia!
            </Text>
          </Group>
          <Tooltip label="Configurar notificações">
            <ActionIcon
              variant="light"
              onClick={onSettingsClick}
            >
              <IconSettings size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Text size="sm" c="dimmed" mt="xs">
          Não há notificações pendentes no momento.
        </Text>
      </Paper>
    );
  }

  return (
    <Stack gap="sm">
      {activeNotifications.map((notification) => {
        const IconComponent = notification.icon;
        
        return (
          <Paper
            key={notification.id}
            p="md"
            withBorder
            style={{
              borderLeft: `4px solid ${theme.colors[notification.color][6]}`
            }}
          >
            <Group justify="space-between" align="flex-start">
              <Group gap="sm" style={{ flex: 1 }}>
                <IconComponent 
                  size={20} 
                  color={theme.colors[notification.color][6]} 
                />
                <Box style={{ flex: 1 }}>
                  <Group gap="xs" align="center" mb="xs">
                    <Text fw={500} size="sm">
                      {notification.title}
                    </Text>
                    {notification.count && (
                      <Badge size="sm" color={notification.color} variant="light">
                        {notification.count}
                      </Badge>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed">
                    {notification.message}
                  </Text>
                </Box>
              </Group>
              
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => dismissNotification(notification.id)}
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          </Paper>
        );
      })}
      
      <Divider />
      
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          {activeNotifications.length} notificação(ões) ativa(s)
        </Text>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconSettings size={14} />}
          onClick={onSettingsClick}
        >
          Configurar
        </Button>
      </Group>
    </Stack>
  );
}





