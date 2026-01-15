// src/components/SearchBar.jsx
import React from 'react';
import {
  TextInput,
  ActionIcon,
  Group,
  Text,
  Box,
  useMantineTheme
} from '@mantine/core';
import {
  IconSearch,
  IconX,
  IconFilter,
  IconRefresh
} from '@tabler/icons-react';

export function SearchBar({
  value,
  onChange,
  onClear,
  onFilterClick,
  onRefresh,
  placeholder = "Buscar...",
  showFilterButton = true,
  showRefreshButton = true,
  resultsCount = null,
  isSearching = false,
  ...props
}) {
  const theme = useMantineTheme();

  return (
    <Box>
      <Group gap="xs" align="center">
        <TextInput
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          leftSection={<IconSearch size={16} />}
          rightSection={
            value && (
              <ActionIcon
                size="sm"
                variant="transparent"
                onClick={onClear}
                disabled={isSearching}
              >
                <IconX size={14} />
              </ActionIcon>
            )
          }
          style={{ flex: 1 }}
          disabled={isSearching}
          {...props}
        />
        
        {showFilterButton && (
          <ActionIcon
            variant="light"
            onClick={onFilterClick}
            disabled={isSearching}
            title="Filtros avançados"
          >
            <IconFilter size={16} />
          </ActionIcon>
        )}
        
        {showRefreshButton && (
          <ActionIcon
            variant="light"
            onClick={onRefresh}
            disabled={isSearching}
            title="Atualizar"
          >
            <IconRefresh size={16} />
          </ActionIcon>
        )}
      </Group>
      
      {resultsCount !== null && (
        <Text size="xs" c="dimmed" mt="xs">
          {isSearching ? 'Buscando...' : `${resultsCount} resultado(s) encontrado(s)`}
        </Text>
      )}
    </Box>
  );
}





