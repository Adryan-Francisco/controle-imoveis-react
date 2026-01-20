// src/components/EnhancedNavbar.jsx
import React from 'react';
import {
  Group,
  Box,
  Breadcrumbs,
  Anchor,
  Text,
  useMantineTheme,
  ActionIcon,
  Tooltip,
  Badge,
  Menu,
  Divider,
  Stack,
  Select,
} from '@mantine/core';
import {
  IconChevronRight,
  IconHome,
  IconRefresh,
  IconBell,
  IconSettings,
  IconUserCircle,
  IconLogout,
  IconCheck,
  IconAlertTriangle,
  IconCalendar,
} from '@tabler/icons-react';

export function EnhancedNavbar({
  currentPage = 'Dashboard',
  breadcrumbs = [],
  onRefresh,
  notificationsCount = 0,
  pendingItems = [],
  user = {},
  colorScheme,
  toggleColorScheme,
  onLogout,
  selectedYear,
  onYearChange,
  yearOptions = [],
  isMobile = false,
}) {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === 'dark';

  const defaultBreadcrumbs = [
    { title: 'Dashboard', href: '/' },
    { title: currentPage, href: '#' },
  ];

  const finalBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  const items = finalBreadcrumbs.map((item, index) => (
    <Anchor
      href={item.href}
      key={index}
      style={{
        fontSize: '0.875rem',
        color: index === finalBreadcrumbs.length - 1 ? 'var(--mantine-color-blue-6)' : 'inherit',
        fontWeight: index === finalBreadcrumbs.length - 1 ? 600 : 400,
        transition: 'all 0.2s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        if (index !== finalBreadcrumbs.length - 1) {
          e.currentTarget.style.color = theme.colors.blue[6];
          e.currentTarget.style.textDecoration = 'underline';
        }
      }}
      onMouseLeave={(e) => {
        if (index !== finalBreadcrumbs.length - 1) {
          e.currentTarget.style.color = 'inherit';
          e.currentTarget.style.textDecoration = 'none';
        }
      }}
    >
      {item.title}
    </Anchor>
  ));

  return (
    <Box
      style={{
        background: isDark
          ? `linear-gradient(90deg, ${theme.colors.dark[8]} 0%, ${theme.colors.dark[7]} 100%)`
          : `linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)`,
        borderBottom: `1px solid ${isDark ? theme.colors.dark[6] : theme.colors.gray[2]}`,
        padding: '1rem 1.5rem',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Group justify="space-between" align="center" wrap="wrap">
        {/* Left: Breadcrumbs */}
        <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <Tooltip label="Home" withArrow>
            <ActionIcon
              variant="subtle"
              size="sm"
              color="blue"
              href="/"
              component="a"
            >
              <IconHome size={18} />
            </ActionIcon>
          </Tooltip>
          <Breadcrumbs
            separator={<IconChevronRight size={14} style={{ opacity: 0.6 }} />}
            style={{ flex: 1, minWidth: 0 }}
          >
            {items}
          </Breadcrumbs>
        </Group>

        {/* Right: Actions */}
        <Group gap="sm" align="center" wrap="nowrap">
          {/* Year Selector */}
          {onYearChange && yearOptions.length > 0 && (
            <Select
              placeholder="Ano"
              data={yearOptions}
              value={selectedYear}
              onChange={onYearChange}
              searchable
              clearable={false}
              maxDropdownHeight={200}
              w={isMobile ? 90 : 110}
              icon={<IconCalendar size={16} />}
              styles={{
                input: {
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                  borderColor: theme.colors.blue[4],
                  color: isDark ? theme.white : theme.black,
                  fontSize: isMobile ? '0.8rem' : '0.9rem',
                  padding: isMobile ? '6px 8px' : '8px 10px',
                  borderRadius: theme.radius.md,
                },
                // Mantine handles option styling internally
                dropdown: {
                  backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
                  borderColor: theme.colors.blue[4],
                },
              }}
            />
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <Tooltip label="Atualizar" withArrow>
              <ActionIcon
                variant="light"
                size="md"
                radius="md"
                color="blue"
                onClick={onRefresh}
                style={{
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(180deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
          )}

          {/* Theme Toggle */}
          <Tooltip label={colorScheme === 'dark' ? "Modo claro" : "Modo escuro"} withArrow>
            <ActionIcon
              variant="light"
              size="md"
              radius="md"
              color="blue"
              onClick={toggleColorScheme}
            >
              {colorScheme === 'dark' ? '☀️' : '🌙'}
            </ActionIcon>
          </Tooltip>

          {/* Notifications */}
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <Tooltip label={`${notificationsCount} notificações`} withArrow>
                <ActionIcon
                  variant="light"
                  size="md"
                  radius="md"
                  color={notificationsCount > 0 ? 'red' : 'gray'}
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
                        top: '-5px',
                        right: '-5px',
                      }}
                    >
                      {notificationsCount > 9 ? '9+' : notificationsCount}
                    </Badge>
                  )}
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown style={{ maxWidth: '350px' }}>
              <Menu.Label>
                <Text fw={600} size="sm">
                  Itens Pendentes ({notificationsCount})
                </Text>
              </Menu.Label>
              <Divider />
              {notificationsCount === 0 ? (
                <Menu.Item disabled>
                  <Text size="sm" c="dimmed">
                    ✅ Nenhum item pendente
                  </Text>
                </Menu.Item>
              ) : (
                pendingItems.slice(0, 5).map((item) => (
                  <Menu.Item key={`pending-${item.title}`} icon={<IconAlertTriangle size={14} color="orange" />}>
                    <Stack gap={2}>
                      <Text size="sm" fw={500}>
                        {item.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {item.description}
                      </Text>
                    </Stack>
                  </Menu.Item>
                ))
              )}
              {notificationsCount > 5 && (
                <>
                  <Divider />
                </>
              )}
            </Menu.Dropdown>
          </Menu>

          {/* Settings */}
          <Tooltip label="Configurações" withArrow>
            <ActionIcon
              variant="light"
              size="md"
              radius="md"
              color="blue"
            >
              <IconSettings size={18} />
            </ActionIcon>
          </Tooltip>

          {/* User Profile */}
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <Tooltip label={user.email || 'Perfil'} withArrow>
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
              <Menu.Label>
                <Text size="sm" fw={500} c="dimmed">
                  {user.email || 'Usuário'}
                </Text>
              </Menu.Label>
              <Divider />
              <Menu.Item 
                icon={<IconLogout size={14} />}
                color="red"
                onClick={onLogout}
              >
                <Text fw={500}>Sair da Conta</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <style>{`
        @media (max-width: 768px) {
          .breadcrumb-container {
            overflow-x: auto;
            scroll-behavior: smooth;
          }
        }
      `}</style>
    </Box>
  );
}

export default EnhancedNavbar;
