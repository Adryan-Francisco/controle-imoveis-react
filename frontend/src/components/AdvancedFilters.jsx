// src/components/AdvancedFilters.jsx
import React, { useState } from 'react';
import {
  Paper,
  Group,
  TextInput,
  Select,
  Button,
  Collapse,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Grid,
  NumberInput,
  useMantineTheme,
  Divider,
  Box
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  IconSearch,
  IconFilter,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconCalendar,
  IconCurrencyReal,
  IconRefresh
} from '@tabler/icons-react';

export function AdvancedFilters({
  filters = {},
  onFilterChange,
  onClearFilters,
  activeFiltersCount = 0,
  isCollapsed = false,
  onToggleCollapse
}) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(!isCollapsed);

  // Garantir que filters tenha valores padrão
  const safeFilters = {
    search: '',
    status: '',
    dateFrom: null,
    dateTo: null,
    valorMin: null,
    valorMax: null,
    ...filters
  };

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'PAGO', label: 'Pago' },
    { value: 'PENDENTE', label: 'Pendente' },
    { value: 'ATRASADO', label: 'Atrasado' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange(key, value);
  };

  const handleClearFilter = (key) => {
    onFilterChange(key, key === 'search' ? '' : null);
  };

  const handleClearAll = () => {
    onClearFilters();
  };

  return (
    <Paper shadow="sm" p="md" radius="md">
      {/* Header com busca rápida */}
      <Group justify="space-between" mb="md">
        <Group gap="sm" style={{ flex: 1 }}>
          <TextInput
            placeholder="Buscar por proprietário, sítio, endereço..."
            value={safeFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              safeFilters.search && (
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  onClick={() => handleClearFilter('search')}
                >
                  <IconX size={14} />
                </ActionIcon>
              )
            }
            style={{ flex: 1, maxWidth: 400 }}
          />
          
          <Button
            variant="light"
            leftSection={<IconFilter size={16} />}
            rightSection={
              opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
            }
            onClick={toggle}
          >
            Filtros
            {activeFiltersCount > 0 && (
              <Badge size="sm" color="blue" ml="xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </Group>

        {activeFiltersCount > 0 && (
          <Button
            variant="subtle"
            color="red"
            leftSection={<IconRefresh size={16} />}
            onClick={handleClearAll}
            size="sm"
          >
            Limpar filtros
          </Button>
        )}
      </Group>

      {/* Filtros avançados */}
      <Collapse in={opened}>
        <Divider mb="md" />
        
        <Grid gutter="md">
          {/* Status */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              label="Status do Pagamento"
              placeholder="Selecione o status"
              data={statusOptions}
              value={safeFilters.status}
              onChange={(value) => handleFilterChange('status', value)}
              leftSection={<IconFilter size={16} />}
            />
          </Grid.Col>

          {/* Data de vencimento - De */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <DatePickerInput
              label="Vencimento de"
              placeholder="Data inicial"
              value={safeFilters.dateFrom}
              onChange={(value) => handleFilterChange('dateFrom', value)}
              leftSection={<IconCalendar size={16} />}
            />
          </Grid.Col>

          {/* Data de vencimento - Até */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <DatePickerInput
              label="Vencimento até"
              placeholder="Data final"
              value={safeFilters.dateTo}
              onChange={(value) => handleFilterChange('dateTo', value)}
              leftSection={<IconCalendar size={16} />}
            />
          </Grid.Col>

          {/* Valor mínimo */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Valor mínimo"
              placeholder="R$ 0,00"
              value={safeFilters.valorMin}
              onChange={(value) => handleFilterChange('valorMin', value)}
              leftSection={<IconCurrencyReal size={16} />}
              min={0}
              decimalScale={2}
              thousandSeparator="."
              decimalSeparator=","
            />
          </Grid.Col>

          {/* Valor máximo */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <NumberInput
              label="Valor máximo"
              placeholder="R$ 0,00"
              value={safeFilters.valorMax}
              onChange={(value) => handleFilterChange('valorMax', value)}
              leftSection={<IconCurrencyReal size={16} />}
              min={0}
              decimalScale={2}
              thousandSeparator="."
              decimalSeparator=","
            />
          </Grid.Col>
        </Grid>

        {/* Filtros ativos */}
        {activeFiltersCount > 0 && (
          <Box mt="md">
            <Text size="sm" fw={500} mb="xs">
              Filtros ativos:
            </Text>
            <Group gap="xs">
              {Object.entries(safeFilters).map(([key, value]) => {
                if (!value || value === '') return null;
                
                let label = '';
                let displayValue = value;
                
                switch (key) {
                  case 'status':
                    label = 'Status:';
                    displayValue = statusOptions.find(opt => opt.value === value)?.label || value;
                    break;
                  case 'dateFrom':
                    label = 'De:';
                    displayValue = new Date(value).toLocaleDateString('pt-BR');
                    break;
                  case 'dateTo':
                    label = 'Até:';
                    displayValue = new Date(value).toLocaleDateString('pt-BR');
                    break;
                  case 'valorMin':
                    label = 'Valor min:';
                    displayValue = `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                    break;
                  case 'valorMax':
                    label = 'Valor max:';
                    displayValue = `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                    break;
                  case 'search':
                    label = 'Busca:';
                    displayValue = value;
                    break;
                  default:
                    return null;
                }
                
                return (
                  <Badge
                    key={key}
                    variant="light"
                    color="blue"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        variant="transparent"
                        onClick={() => handleClearFilter(key)}
                      >
                        <IconX size={10} />
                      </ActionIcon>
                    }
                  >
                    {label} {displayValue}
                  </Badge>
                );
              })}
            </Group>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}