// src/components/DashboardHeader.jsx
import React from 'react';
import { 
  Group, Title, Text, Box, Breadcrumbs, Anchor, Stack, useMantineTheme, Button, ActionIcon,
  Tooltip
} from '@mantine/core';
import { IconChevronRight, IconRefresh } from '@tabler/icons-react';

export function DashboardHeader({ 
  greeting, 
  breadcrumbs = [], 
  onRefresh,
  stats,
  colorScheme
}) {
  const theme = useMantineTheme();
  const isDark = colorScheme === 'dark';

  const breadcrumbItems = breadcrumbs.map((item) => (
    <Anchor key={`breadcrumb-${item.title}`} href={item.href || '#'} underline="hover">
      {item.title}
    </Anchor>
  ));

  return (
    <Box
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${theme.colors.dark[8]} 0%, ${theme.colors.dark[7]} 100%)`
          : `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`,
        borderBottom: `1px solid ${isDark ? theme.colors.dark[6] : theme.colors.gray[2]}`,
        padding: '1.5rem',
        marginBottom: '2rem',
        borderRadius: theme.radius.md,
        transition: 'all 0.3s ease'
      }}
      mb="xl"
    >
      <Stack gap="md">
        {/* Breadcrumb */}
        {breadcrumbItems.length > 0 && (
          <Breadcrumbs
            separator={<IconChevronRight size={16} />}
            separatorMargin="xs"
            size="sm"
          >
            {breadcrumbItems}
          </Breadcrumbs>
        )}

        {/* Greeting e Actions */}
        <Group justify="space-between" align="flex-end">
          <Stack gap={0}>
            <Title order={1} size="h1" fw={800} style={{
              background: `linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {greeting}
            </Title>
            <Text size="sm" c="dimmed" mt="xs">
              {new Intl.DateTimeFormat('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date())}
            </Text>
          </Stack>

          {/* Action Buttons */}
          <Group gap="xs">
            {onRefresh && (
              <Tooltip label="Atualizar dados" withArrow>
                <ActionIcon
                  variant="light"
                  onClick={onRefresh}
                  size="lg"
                  radius="md"
                  color="blue"
                >
                  <IconRefresh size={20} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>

        {/* Stats Preview */}
        {stats && stats.length > 0 && (
          <Group grow>
            {stats.map((stat) => (
              <Box
                key={`stat-${stat.label}`}
                p="sm"
                style={{
                  background: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
                  borderRadius: theme.radius.md,
                  border: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`
                }}
              >
                <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
                  {stat.label}
                </Text>
                <Text size="lg" fw={700} style={{
                  background: stat.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {stat.value}
                </Text>
              </Box>
            ))}
          </Group>
        )}
      </Stack>
    </Box>
  );
}

export default DashboardHeader;
