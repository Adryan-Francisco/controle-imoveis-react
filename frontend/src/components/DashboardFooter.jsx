// src/components/DashboardFooter.jsx
import React from 'react';
import { 
  Box, Group, Text, Stack, Divider, useMantineTheme, ActionIcon, Tooltip
} from '@mantine/core';
import { 
  IconBrandGithub, IconBrandLinkedin, IconMail, IconClock, IconServer
} from '@tabler/icons-react';

export function DashboardFooter() {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === 'dark';
  const version = '1.0.0';
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      style={{
        background: isDark
          ? `linear-gradient(135deg, ${theme.colors.dark[8]} 0%, ${theme.colors.dark[7]} 100%)`
          : `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`,
        borderTop: `1px solid ${isDark ? theme.colors.dark[6] : theme.colors.gray[2]}`,
        padding: '2rem 1.5rem',
        marginTop: '4rem',
      }}
    >
      <Stack gap="lg">
        {/* Main Footer Content */}
        <Group justify="space-between" align="flex-start" grow>
          {/* About Section */}
          <Stack gap="xs">
            <Text fw={600} size="sm" tt="uppercase" c="dimmed">
              Sobre
            </Text>
            <Text size="sm">
              Sistema de gestão de imóveis rurais com integração a dados fiscais
            </Text>
          </Stack>

          {/* Quick Links */}
          <Stack gap="xs">
            <Text fw={600} size="sm" tt="uppercase" c="dimmed">
              Links Rápidos
            </Text>
            <Group gap="xs">
              <Tooltip label="Documentação" withArrow>
                <ActionIcon
                  variant="light"
                  size="sm"
                  radius="md"
                  color="blue"
                >
                  📚
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Suporte via WhatsApp" withArrow>
                <ActionIcon
                  variant="light"
                  size="sm"
                  radius="md"
                  color="blue"
                  component="a"
                  href="https://wa.me/5517996231865?text=Olá! Preciso de suporte no sistema de gestão de imóveis."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬
                </ActionIcon>
              </Tooltip>
              <Tooltip label="GitHub" withArrow>
                <ActionIcon
                  variant="light"
                  size="sm"
                  radius="md"
                  color="blue"
                  component="a"
                  href="https://github.com"
                  target="_blank"
                >
                  <IconBrandGithub size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Stack>

          {/* Status */}
          <Stack gap="xs">
            <Text fw={600} size="sm" tt="uppercase" c="dimmed">
              Status
            </Text>
            <Group gap="xs">
              <Box
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  animation: 'pulse 2s infinite'
                }}
              />
              <Text size="sm">Sistema operacional</Text>
            </Group>
          </Stack>
        </Group>

        <Divider />

        {/* Bottom Footer */}
        <Group justify="space-between" align="center" wrap="nowrap">
          <Text size="xs" c="dimmed">
            © {currentYear} Controle de Imóveis. Todos os direitos reservados.
          </Text>

          <Group gap="lg">
            <Group gap="xs" wrap="nowrap">
              <IconClock size={14} style={{ opacity: 0.6 }} />
              <Text size="xs" c="dimmed">
                v{version}
              </Text>
            </Group>

            <Group gap="xs" wrap="nowrap">
              <IconServer size={14} style={{ opacity: 0.6 }} />
              <Text size="xs" c="dimmed">
                Online
              </Text>
            </Group>
          </Group>
        </Group>
      </Stack>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </Box>
  );
}

export default DashboardFooter;
