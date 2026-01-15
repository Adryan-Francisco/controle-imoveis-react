// src/components/StatisticsCards.jsx
import React, { memo } from 'react';
import { Grid, Card, Group, Text, useMantineTheme } from '@mantine/core';
import { IconHome, IconCash, IconAlertTriangle, IconCheck } from '@tabler/icons-react';

export const StatisticsCards = memo(function StatisticsCards({ statistics }) {
  const theme = useMantineTheme();

  const cards = [
    {
      title: 'Total de Imóveis',
      value: statistics.totalImoveis,
      icon: IconHome,
      color: theme.colors.blue[6]
    },
    {
      title: 'Valor Total',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statistics.valorTotal),
      icon: IconCash,
      color: theme.colors.green[6]
    },
    {
      title: 'Pendente',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statistics.valorPendente),
      icon: IconAlertTriangle,
      color: theme.colors.orange[6]
    },
    {
      title: 'Valor Recebido',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statistics.valorRecebido),
      icon: IconCheck,
      color: theme.colors.green[6]
    }
  ];

  return (
    <Grid gutter="md" mb="md">
      {cards.map((card, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
          <Card 
            withBorder 
            p="md" 
            radius="lg" 
            style={{ 
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.shadows.sm;
            }}
          >
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                  {card.title}
                </Text>
                <Text size="xl" fw={700} style={{ color: card.color }}>
                  {card.value}
                </Text>
              </div>
              <card.icon size={24} color={card.color} />
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
});
