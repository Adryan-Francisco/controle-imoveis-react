// src/components/SkeletonLoader.jsx
import React from 'react';
import { Stack, Group, Box, Skeleton, useMantineTheme } from '@mantine/core';

export function SkeletonLoader({ 
  type = 'card', 
  count = 1,
  radius = 'md',
  animate = true,
}) {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === 'dark';

  const skeletonStyle = {
    animation: animate ? `skeleton-loading 1.5s infinite` : 'none',
  };

  const renderSkeletons = () => {
    switch (type) {
      case 'card':
        return (
          <Stack gap="md" repeat={count}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <Box
                  key={`skeleton-card-${i}`}
                  p="md"
                  style={{
                    background: isDark ? theme.colors.dark[7] : theme.colors.gray[1],
                    borderRadius: theme.radius[radius],
                    border: `1px solid ${isDark ? theme.colors.dark[6] : theme.colors.gray[2]}`,
                  }}
                >
                  <Stack gap="md">
                    <Skeleton height={40} width="60%" radius="sm" animate={animate} />
                    <Skeleton height={20} width="100%" radius="sm" animate={animate} />
                    <Skeleton height={20} width="80%" radius="sm" animate={animate} />
                  </Stack>
                </Box>
              ))}
          </Stack>
        );

      case 'table':
        return (
          <Stack gap="sm" repeat={count}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <Group key={`skeleton-table-${i}`} gap="md" align="center">
                  <Skeleton height={20} width={20} circle animate={animate} />
                  <Skeleton height={20} width="20%" radius="sm" animate={animate} />
                  <Skeleton height={20} width="30%" radius="sm" animate={animate} />
                  <Skeleton height={20} width="25%" radius="sm" animate={animate} />
                  <Skeleton height={20} width="15%" radius="sm" animate={animate} />
                </Group>
              ))}
          </Stack>
        );

      case 'chart':
        return (
          <Stack gap="md" repeat={count}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <Box key={i}>
                  <Skeleton height={20} width="40%" radius="sm" animate={animate} />
                  <Skeleton height={200} radius="md" animate={animate} mt="md" />
                </Box>
              ))}
          </Stack>
        );

      case 'avatar':
        return (
          <Group gap="md" repeat={count}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <Stack key={`skeleton-avatar-${i}`} gap="xs" align="center">
                  <Skeleton height={64} width={64} circle animate={animate} />
                  <Skeleton height={16} width={80} radius="sm" animate={animate} />
                </Stack>
              ))}
          </Group>
        );

      case 'text':
      default:
        return (
          <Stack gap="sm" repeat={count}>
            {Array(count)
              .fill(0)
              .map((_, i) => (
                <Box key={i}>
                  <Skeleton height={20} width="100%" radius="sm" animate={animate} />
                  <Skeleton height={20} width="95%" radius="sm" animate={animate} mt="xs" />
                  <Skeleton height={20} width="90%" radius="sm" animate={animate} mt="xs" />
                </Box>
              ))}
          </Stack>
        );
    }
  };

  return (
    <Box style={skeletonStyle}>
      <style>{`
        @keyframes skeleton-loading {
          0% {
            background-color: ${isDark ? theme.colors.dark[6] : theme.colors.gray[2]};
          }
          50% {
            background-color: ${isDark ? theme.colors.dark[5] : theme.colors.gray[3]};
          }
          100% {
            background-color: ${isDark ? theme.colors.dark[6] : theme.colors.gray[2]};
          }
        }
        
        .skeleton-item {
          animation: skeleton-loading 1.5s infinite;
        }
      `}</style>
      {renderSkeletons()}
    </Box>
  );
}

export default SkeletonLoader;
