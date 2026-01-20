// src/components/AppHeader.jsx
import React from 'react';
import {
  Group,
  ActionIcon,
  Tooltip,
  Box,
  Badge,
  Menu,
  Text,
  Divider,
  Stack
} from '@mantine/core';
import {
  IconSearch,
  IconBell,
  IconUserCircle,
  IconSettings,
  IconLogout,
  IconHelp,
  IconDownload,
  IconRefresh
} from '@tabler/icons-react';

export function AppHeader({
  onSearch,
  onNotifications,
  onProfile,
  onSettings,
  onLogout,
  notificationsCount = 0,
  user = {},
}) {
  return (
    <Group
      justify="flex-end"
      gap="md"
      p="md"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 99,
      }}
    >
      {/* Search Icon */}
      <Tooltip label="Buscar" withArrow>
        <ActionIcon
          variant="light"
          size="md"
          radius="md"
          color="blue"
          onClick={onSearch}
        >
          <IconSearch size={18} />
        </ActionIcon>
      </Tooltip>

      {/* Notifications Icon */}
      <Tooltip label={`${notificationsCount} notificações`} withArrow>
        <ActionIcon
          variant="light"
          size="md"
          radius="md"
          color={notificationsCount > 0 ? 'red' : 'gray'}
          onClick={onNotifications}
          style={{ position: 'relative' }}
        >
          <IconBell size={18} />
          {notificationsCount > 0 && (
            <Badge
              size="xs"
              circle
              color="red"
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
              }}
            >
              {notificationsCount > 9 ? '9+' : notificationsCount}
            </Badge>
          )}
        </ActionIcon>
      </Tooltip>

      {/* User Profile Menu */}
      <Menu position="bottom-end" withArrow>
        <Menu.Target>
          <Tooltip label="Perfil" withArrow>
            <ActionIcon
              variant="light"
              size="md"
              radius="md"
              color="blue"
            >
              <IconUserCircle size={18} />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{user?.email || 'Usuário'}</Menu.Label>
          <Divider />
          <Menu.Item
            icon={<IconUserCircle size={14} />}
            onClick={onProfile}
          >
            Meu Perfil
          </Menu.Item>
          <Menu.Item
            icon={<IconSettings size={14} />}
            onClick={onSettings}
          >
            Configurações
          </Menu.Item>
          <Menu.Item
            icon={<IconHelp size={14} />}
            onClick={() => window.open('https://wa.me/5517996231865?text=Preciso de ajuda', '_blank')}
          >
            Ajuda
          </Menu.Item>
          <Divider />
          <Menu.Item
            icon={<IconLogout size={14} />}
            color="red"
            onClick={onLogout}
          >
            Sair
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* Settings Icon */}
      <Tooltip label="Configurações" withArrow>
        <ActionIcon
          variant="light"
          size="md"
          radius="md"
          color="blue"
          onClick={onSettings}
        >
          <IconSettings size={18} />
        </ActionIcon>
      </Tooltip>

      {/* Help Icon */}
      <Tooltip label="Ajuda & Suporte" withArrow>
        <ActionIcon
          variant="light"
          size="md"
          radius="md"
          color="blue"
          onClick={() => window.open('https://wa.me/5517996231865?text=Preciso de ajuda no sistema', '_blank')}
        >
          <IconHelp size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}

export default AppHeader;
