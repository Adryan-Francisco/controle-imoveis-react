// src/components/ChartsSection.jsx
import React, { memo } from 'react';
import { Grid, Card, Title, Group, Box, Text, useMantineTheme } from '@mantine/core';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export const ChartsSection = memo(function ChartsSection({ statusData }) {
  const theme = useMantineTheme();

  return (
    <Grid gutter="lg" mb="xl">
      <Grid.Col span={12}>
        <Card 
          withBorder 
          p="lg" 
          radius="lg" 
          style={{ 
            background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
            height: '300px'
          }}
        >
          <Title order={4} mb="md" style={{ color: theme.colors.blue[6] }}>
            Status dos Imóveis
          </Title>
          <ResponsiveContainer width="100%" height="200px">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
          <Group justify="center" mt="md">
            {statusData.map((item, index) => (
              <Group key={index} gap="xs">
                <Box 
                  style={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: item.color 
                  }} 
                />
                <Text size="sm">{item.name}: {item.value}</Text>
              </Group>
            ))}
          </Group>
        </Card>
      </Grid.Col>
    </Grid>
  );
});
