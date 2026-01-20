// src/components/StatisticsCards.jsx
import React, { memo, useState } from 'react';
import { Grid, Card, Group, Text, useMantineTheme, Box, Stack, ThemeIcon, Progress } from '@mantine/core';
import { IconHome, IconCash, IconAlertTriangle, IconCheck } from '@tabler/icons-react';

export const StatisticsCards = memo(function StatisticsCards({ statistics }) {
  const theme = useMantineTheme();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cards = [
    {
      title: 'Total de Imóveis',
      value: statistics.totalImoveis,
      icon: IconHome,
      color: theme.colors.blue[6],
      bgGradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      percentage: Math.min((statistics.totalImoveis / 100) * 100, 100)
    },
    {
      title: 'Valor Total',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statistics.valorTotal),
      icon: IconCash,
      color: theme.colors.green[6],
      bgGradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      percentage: 75
    },
    {
      title: 'Pendente',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statistics.valorPendente),
      icon: IconAlertTriangle,
      color: theme.colors.orange[6],
      bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      percentage: Math.min((statistics.valorPendente / statistics.valorTotal) * 100, 100)
    },
    {
      title: 'Valor Recebido',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(statistics.valorRecebido),
      icon: IconCheck,
      color: theme.colors.green[6],
      bgGradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      percentage: Math.min((statistics.valorRecebido / statistics.valorTotal) * 100, 100)
    }
  ];

  return (
    <Grid gutter="md" mb="md">
      {cards.map((card, index) => (
        <Grid.Col key={`stat-${card.title}`} span={{ base: 12, sm: 6, md: 3 }}>
          <Card 
            withBorder 
            p="lg" 
            radius="lg"
            className="statistics-card"
            style={{ 
              background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              border: `2px solid ${card.color}20`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              transform: hoveredIndex === index ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hoveredIndex === index 
                ? `0 12px 24px ${card.color}20` 
                : `0 4px 6px ${theme.colorScheme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
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
              <ThemeIcon 
                size="lg" 
                radius="md" 
                variant="light"
                style={{ background: `${card.color}20` }}
              >
                <card.icon size={24} color={card.color} />
              </ThemeIcon>
            </Group>

            <Progress 
              value={card.percentage} 
              color={card.color}
              size="sm"
              radius="md"
              mt="md"
            />
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
});
