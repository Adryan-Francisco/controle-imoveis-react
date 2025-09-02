// src/components/ResponsiveSidebar.jsx
import React from 'react';
import { 
  Drawer, 
  Paper, 
  Group, 
  ActionIcon, 
  Text, 
  Title, 
  Button,
  useMantineTheme,
  Stack,
  Divider
} from '@mantine/core';
import { 
  IconHome, 
  IconSun, 
  IconMoonStars, 
  IconLogout,
  IconMenu2,
  IconX,
  IconChartBar,
  IconList
} from '@tabler/icons-react';

export function ResponsiveSidebar({ 
  opened, 
  onClose, 
  user, 
  colorScheme, 
  toggleColorScheme, 
  signOut,
  isMobile,
  currentPage,
  onNavigate
}) {
  const theme = useMantineTheme();

  const headerContent = (
    <Group justify="space-between" w="100%">
      <Group>
        <IconHome size={28} color={theme.colors.blue[6]} />
        <Title order={2} style={{ color: theme.colors.blue[6] }}>
          {isMobile ? 'Imóveis' : 'Controle de Imóveis Rurais'}
        </Title>
      </Group>
      
      {isMobile && (
        <ActionIcon 
          onClick={onClose}
          variant="light"
          size="lg"
          radius="md"
        >
          <IconX size="1.2rem" />
        </ActionIcon>
      )}
    </Group>
  );

  const navigationSection = (
    <Stack gap="sm">
      <Button
        variant={currentPage === 'dashboard' ? 'filled' : 'light'}
        leftSection={<IconHome size={16} />}
        onClick={() => onNavigate && onNavigate('dashboard')}
        fullWidth
        justify="flex-start"
      >
        Dashboard
      </Button>
      
      <Button
        variant={currentPage === 'imoveis' ? 'filled' : 'light'}
        leftSection={<IconList size={16} />}
        onClick={() => onNavigate && onNavigate('imoveis')}
        fullWidth
        justify="flex-start"
      >
        Imóveis
      </Button>
      
      <Button
        variant={currentPage === 'reports' ? 'filled' : 'light'}
        leftSection={<IconChartBar size={16} />}
        onClick={() => onNavigate && onNavigate('reports')}
        fullWidth
        justify="flex-start"
      >
        Relatórios
      </Button>
    </Stack>
  );

  const userSection = (
    <Stack gap="sm">
      <Divider />
      <Group justify="space-between">
        <Text size="sm" c="dimmed" style={{ fontWeight: 500 }}>
          Olá, {user?.email}
        </Text>
      </Group>
      
      <Group gap="sm">
        <ActionIcon 
          onClick={toggleColorScheme} 
          size="lg" 
          variant="light" 
          radius="md"
          style={{ 
            background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`
          }}
        >
          {colorScheme === 'dark' ? <IconSun size="1.2rem" /> : <IconMoonStars size="1.2rem" />}
        </ActionIcon>
        
        <Button 
          onClick={signOut} 
          variant="light" 
          color="red" 
          leftSection={<IconLogout size={16} />}
          radius="md"
          size="sm"
        >
          Sair
        </Button>
      </Group>
    </Stack>
  );

  if (isMobile) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        title={headerContent}
        size="280px"
        padding="md"
        position="left"
        styles={{
          header: {
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
            marginBottom: theme.spacing.md,
          }
        }}
      >
        <Stack gap="md">
          {navigationSection}
          {userSection}
        </Stack>
      </Drawer>
    );
  }

  return (
    <Paper 
      w={280} 
      p="md" 
      h="100vh"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      }}
    >
      <Stack gap="md">
        {headerContent}
        {navigationSection}
        {userSection}
      </Stack>
    </Paper>
  );
}
