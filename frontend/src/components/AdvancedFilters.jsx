// src/components/AdvancedFilters.jsx
import React, { useState, useMemo } from 'react';
import {
  Paper,
  Group,
  TextInput,
  Select,
  NumberInput,
  Button,
  ActionIcon,
  Collapse,
  Stack,
  Text,
  Badge,
  useMantineTheme,
  Grid,
  Flex
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
  IconUser,
  IconMapPin
} from '@tabler/icons-react';

export function AdvancedFilters({ 
  imoveis, 
  onFilter, 
  isMobile = false 
}) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    minValue: '',
    maxValue: '',
    startDate: null,
    endDate: null,
    proprietario: '',
    localizacao: ''
  });

  // Opções para o select de status
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pago', label: 'Pago' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'atrasado', label: 'Atrasado' }
  ];

  // Aplicar filtros
  const filteredImoveis = useMemo(() => {
    return imoveis.filter(imovel => {
      // Filtro de busca geral
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          imovel.proprietario?.toLowerCase().includes(searchLower) ||
          imovel.cpf?.includes(searchLower) ||
          imovel.localizacao?.toLowerCase().includes(searchLower) ||
          imovel.telefone?.includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro de status
      if (filters.status && imovel.status !== filters.status) {
        return false;
      }

      // Filtro de valor mínimo
      if (filters.minValue && imovel.valor < parseFloat(filters.minValue)) {
        return false;
      }

      // Filtro de valor máximo
      if (filters.maxValue && imovel.valor > parseFloat(filters.maxValue)) {
        return false;
      }

      // Filtro de data início
      if (filters.startDate && imovel.dataVencimento < filters.startDate) {
        return false;
      }

      // Filtro de data fim
      if (filters.endDate && imovel.dataVencimento > filters.endDate) {
        return false;
      }

      // Filtro de proprietário
      if (filters.proprietario) {
        const proprietarioLower = filters.proprietario.toLowerCase();
        if (!imovel.proprietario?.toLowerCase().includes(proprietarioLower)) {
          return false;
        }
      }

      // Filtro de localização
      if (filters.localizacao) {
        const localizacaoLower = filters.localizacao.toLowerCase();
        if (!imovel.localizacao?.toLowerCase().includes(localizacaoLower)) {
          return false;
        }
      }

      return true;
    });
  }, [imoveis, filters]);

  // Contar filtros ativos
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== null
  ).length;

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(filteredImoveis);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      minValue: '',
      maxValue: '',
      startDate: null,
      endDate: null,
      proprietario: '',
      localizacao: ''
    };
    setFilters(clearedFilters);
    onFilter(imoveis);
  };

  const applyFilters = () => {
    onFilter(filteredImoveis);
  };

  return (
    <Paper shadow="sm" p="md" radius="md" mb="md">
      {/* Barra de busca principal */}
      <Group mb="md">
        <TextInput
          placeholder="Buscar por proprietário, CPF, localização..."
          leftSection={<IconSearch size={16} />}
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          style={{ flex: 1 }}
          size={isMobile ? 'sm' : 'md'}
        />
        
        <Button
          leftSection={<IconFilter size={16} />}
          rightSection={opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          onClick={toggle}
          variant="light"
          size={isMobile ? 'sm' : 'md'}
        >
          Filtros
          {activeFiltersCount > 0 && (
            <Badge size="xs" color="blue" ml="xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </Group>

      {/* Filtros avançados */}
      <Collapse in={opened}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={isMobile ? 12 : 6}>
              <Select
                label="Status"
                placeholder="Selecione o status"
                data={statusOptions}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                leftSection={<IconUser size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 12 : 6}>
              <TextInput
                label="Proprietário"
                placeholder="Nome do proprietário"
                value={filters.proprietario}
                onChange={(e) => handleFilterChange('proprietario', e.target.value)}
                leftSection={<IconUser size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 12 : 6}>
              <NumberInput
                label="Valor Mínimo"
                placeholder="R$ 0,00"
                value={filters.minValue}
                onChange={(value) => handleFilterChange('minValue', value)}
                leftSection={<IconCurrencyReal size={16} />}
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
              />
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 12 : 6}>
              <NumberInput
                label="Valor Máximo"
                placeholder="R$ 0,00"
                value={filters.maxValue}
                onChange={(value) => handleFilterChange('maxValue', value)}
                leftSection={<IconCurrencyReal size={16} />}
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
              />
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 12 : 6}>
              <DatePickerInput
                label="Data Início"
                placeholder="Selecione a data"
                value={filters.startDate}
                onChange={(value) => handleFilterChange('startDate', value)}
                leftSection={<IconCalendar size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={isMobile ? 12 : 6}>
              <DatePickerInput
                label="Data Fim"
                placeholder="Selecione a data"
                value={filters.endDate}
                onChange={(value) => handleFilterChange('endDate', value)}
                leftSection={<IconCalendar size={16} />}
              />
            </Grid.Col>
            
            <Grid.Col span={12}>
              <TextInput
                label="Localização"
                placeholder="Cidade, estado, região..."
                value={filters.localizacao}
                onChange={(e) => handleFilterChange('localizacao', e.target.value)}
                leftSection={<IconMapPin size={16} />}
              />
            </Grid.Col>
          </Grid>

          {/* Botões de ação */}
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {filteredImoveis.length} de {imoveis.length} imóveis encontrados
            </Text>
            
            <Group gap="sm">
              <Button
                variant="outline"
                leftSection={<IconX size={16} />}
                onClick={clearFilters}
                size="sm"
              >
                Limpar
              </Button>
              
              <Button
                onClick={applyFilters}
                size="sm"
              >
                Aplicar Filtros
              </Button>
            </Group>
          </Group>
        </Stack>
      </Collapse>
    </Paper>
  );
}
