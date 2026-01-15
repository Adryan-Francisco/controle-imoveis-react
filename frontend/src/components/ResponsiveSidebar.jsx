// src/components/ResponsiveSidebar.jsx
import React, { useState } from 'react';
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
  Divider,
  Tooltip
} from '@mantine/core';
import { 
  IconHome, 
  IconSun, 
  IconMoonStars, 
  IconLogout,
  IconMenu2,
  IconX,
  IconChartBar,
  IconList,
  IconBuilding,
  IconChevronLeft,
  IconChevronRight
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
  onNavigate,
  minimized,
  onMinimizedChange
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
      <Tooltip label="Dashboard" position="right" disabled={!minimized}>
        <Button
          variant={currentPage === 'dashboard' ? 'filled' : 'light'}
          leftSection={<IconHome size={16} />}
          onClick={() => onNavigate && onNavigate('dashboard')}
          fullWidth
          justify={minimized ? 'center' : 'flex-start'}
        >
          {!minimized && 'Dashboard'}
        </Button>
      </Tooltip>
      
      <Tooltip label="Imóveis" position="right" disabled={!minimized}>
        <Button
          variant={currentPage === 'imoveis' ? 'filled' : 'light'}
          leftSection={<IconList size={16} />}
          onClick={() => onNavigate && onNavigate('imoveis')}
          fullWidth
          justify={minimized ? 'center' : 'flex-start'}
        >
          {!minimized && 'Imóveis'}
        </Button>
      </Tooltip>

      <Tooltip label="Empresas" position="right" disabled={!minimized}>
        <Button
          variant={currentPage === 'companies' ? 'filled' : 'light'}
          leftSection={<IconBuilding size={16} />}
          onClick={() => onNavigate && onNavigate('companies')}
          fullWidth
          justify={minimized ? 'center' : 'flex-start'}
        >
          {!minimized && 'Empresas'}
        </Button>
      </Tooltip>
      
      <Tooltip label="Relatórios" position="right" disabled={!minimized}>
        <Button
          variant={currentPage === 'reports' ? 'filled' : 'light'}
          leftSection={<IconChartBar size={16} />}
          onClick={() => onNavigate && onNavigate('reports')}
          fullWidth
          justify={minimized ? 'center' : 'flex-start'}
        >
          {!minimized && 'Relatórios'}
        </Button>
      </Tooltip>
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
      w={minimized ? 80 : 280} 
      p="md" 
      h="100vh"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}
    >
      <Stack gap="md" h="100%" justify="space-between">
        <Stack gap="md">
          <Group justify="space-between" align="center">
            {!minimized && (
              <Group>
                <IconHome size={28} color={theme.colors.blue[6]} />
                <Title order={2} style={{ color: theme.colors.blue[6], whiteSpace: 'nowrap' }}>
                  Imóveis
                </Title>
              </Group>
            )}
            <Tooltip label={minimized ? 'Expandir' : 'Minimizar'} position="right">
              <ActionIcon 
                onClick={() => onMinimizedChange(!minimized)}
                variant="light"
                size="lg"
                radius="md"
              >
                {minimized ? <IconChevronRight size="1.2rem" /> : <IconChevronLeft size="1.2rem" />}
              </ActionIcon>
            </Tooltip>
          </Group>
          {navigationSection}
        </Stack>
        
        <Stack gap="sm">
          <Divider />
          {!minimized && (
            <Text size="sm" c="dimmed" style={{ fontWeight: 500 }}>
              Olá, {user?.email}
            </Text>
          )}
          
          <Group gap="sm" justify={minimized ? 'center' : 'flex-start'}>
            <Tooltip label={colorScheme === 'dark' ? 'Modo claro' : 'Modo escuro'} position="right">
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
            </Tooltip>
            
            {!minimized && (
              <Button 
                onClick={signOut} 
                variant="light" 
                color="red" 
                leftSection={<IconLogout size={16} />}
                radius="md"
                size="sm"
                fullWidth
              >
                Sair
              </Button>
            )}
            {minimized && (
              <Tooltip label="Sair" position="right">
                <ActionIcon 
                  onClick={signOut}
                  variant="light"
                  color="red"
                  size="lg"
                  radius="md"
                >
                  <IconLogout size="1.2rem" />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
}
