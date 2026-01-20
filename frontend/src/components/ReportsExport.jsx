// src/components/ReportsExport.jsx
import React, { useState } from 'react';
import {
  Paper,
  Group,
  Button,
  Select,
  Modal,
  Stack,
  Text,
  Progress,
  Alert,
  Grid,
  NumberInput,
  TextInput,
  Divider,
  Checkbox,
  Badge
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconFileExport, 
  IconChartBar, 
  IconDownload,
  IconFileText,
  IconTable,
  IconCalendar,
  IconCurrencyReal,
  IconCheck,
  IconAlertCircle,
  IconFileSpreadsheet,
  IconWorld
} from '@tabler/icons-react';
import { exportToPDF, exportToExcel, exportToCSV, exportToHTML } from '../utils/exportUtils';

export function ReportsExport({ imoveis, isMobile = false }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportType, setExportType] = useState('pdf');
  const [reportType, setReportType] = useState('summary');

  // Opções de exportação
  const exportOptions = [
    { value: 'pdf', label: 'PDF', icon: IconFileText, color: 'red' },
    { value: 'excel', label: 'Excel', icon: IconFileSpreadsheet, color: 'green' },
    { value: 'csv', label: 'CSV', icon: IconTable, color: 'blue' },
    { value: 'html', label: 'HTML', icon: IconWorld, color: 'violet' }
  ];

  // Tipos de relatório
  const reportTypes = [
    { value: 'summary', label: 'Resumo Executivo', description: 'Visão geral dos dados' },
    { value: 'detailed', label: 'Relatório Detalhado', description: 'Todos os dados completos' },
    { value: 'financial', label: 'Relatório Financeiro', description: 'Foco em valores e pagamentos' },
    { value: 'custom', label: 'Relatório Personalizado', description: 'Configure seus próprios filtros' }
  ];

  // Opções de filtros
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: null,
    dateTo: null,
    valorMin: null,
    valorMax: null,
    includeStatistics: true,
    includeCharts: false
  });

  // Função de exportação
  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);
    
    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);
      
      // Aplicar filtros
      let filteredData = imoveis;
      if (filters.status) {
        filteredData = filteredData.filter(item => item.status_pagamento === filters.status);
      }
      if (filters.dateFrom) {
        filteredData = filteredData.filter(item => 
          item.data_vencimento && new Date(item.data_vencimento) >= filters.dateFrom
        );
      }
      if (filters.dateTo) {
        filteredData = filteredData.filter(item => 
          item.data_vencimento && new Date(item.data_vencimento) <= filters.dateTo
        );
      }
      if (filters.valorMin !== null) {
        filteredData = filteredData.filter(item => (item.valor || 0) >= filters.valorMin);
      }
      if (filters.valorMax !== null) {
        filteredData = filteredData.filter(item => (item.valor || 0) <= filters.valorMax);
      }
      
      // Gerar nome do arquivo
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `imoveis-rurais-${reportType}-${timestamp}`;
      
      // Exportar baseado no formato
      switch (exportType) {
        case 'pdf':
          exportToPDF(filteredData, `${filename}.pdf`, `Relatório de Imóveis Rurais - ${reportTypes.find(r => r.value === reportType)?.label}`);
          break;
        case 'excel':
          exportToExcel(filteredData, `${filename}.xlsx`, `Relatório de Imóveis Rurais - ${reportTypes.find(r => r.value === reportType)?.label}`);
          break;
        case 'csv':
          exportToCSV(filteredData, `${filename}.csv`);
          break;
        case 'html':
          exportToHTML(filteredData, `${filename}.html`, `Relatório de Imóveis Rurais - ${reportTypes.find(r => r.value === reportType)?.label}`);
          break;
        default:
          throw new Error('Formato de exportação não suportado');
      }
      
      setExportProgress(100);
      setTimeout(() => {
        setExporting(false);
        setExportProgress(0);
        close();
      }, 500);
      
    } catch (error) {
      console.error('Erro ao exportar:', error);
      setExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <>
      <Button
        leftSection={<IconFileExport size={16} />}
        onClick={open}
        variant="light"
        color="blue"
        size={isMobile ? 'sm' : 'md'}
      >
        {isMobile ? 'Exportar' : 'Exportar Relatórios'}
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Exportar Relatórios"
        size="lg"
        centered
      >
        <Stack gap="md">
          {/* Tipo de relatório */}
          <Select
            label="Tipo de Relatório"
            placeholder="Selecione o tipo"
            data={reportTypes.map(type => ({
              value: type.value,
              label: type.label
            }))}
            value={reportType}
            onChange={setReportType}
            leftSection={<IconChartBar size={16} />}
          />
          
          {reportType && (
            <Text size="sm" c="dimmed">
              {reportTypes.find(r => r.value === reportType)?.description}
            </Text>
          )}

          {/* Formato de exportação */}
          <Select
            label="Formato de Exportação"
            placeholder="Selecione o formato"
            data={exportOptions.map(option => ({
              value: option.value,
              label: option.label
            }))}
            value={exportType}
            onChange={setExportType}
            leftSection={<IconFileText size={16} />}
          />

          {/* Filtros avançados */}
          {reportType === 'custom' && (
            <Paper p="md" withBorder>
              <Text fw={500} mb="md">Filtros Personalizados</Text>
              
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Status"
                    placeholder="Todos os status"
                    data={[
                      { value: '', label: 'Todos' },
                      { value: 'PAGO', label: 'Pago' },
                      { value: 'PENDENTE', label: 'Pendente' },
                      { value: 'ATRASADO', label: 'Atrasado' }
                    ]}
                    value={filters.status}
                    onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  />
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <DatePickerInput
                    label="Data de Vencimento - De"
                    placeholder="Selecione a data"
                    value={filters.dateFrom}
                    onChange={(date) => setFilters(prev => ({ ...prev, dateFrom: date }))}
                    leftSection={<IconCalendar size={16} />}
                  />
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <DatePickerInput
                    label="Data de Vencimento - Até"
                    placeholder="Selecione a data"
                    value={filters.dateTo}
                    onChange={(date) => setFilters(prev => ({ ...prev, dateTo: date }))}
                    leftSection={<IconCalendar size={16} />}
                  />
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <NumberInput
                    label="Valor Mínimo"
                    placeholder="R$ 0,00"
                    value={filters.valorMin}
                    onChange={(value) => setFilters(prev => ({ ...prev, valorMin: value }))}
                    leftSection={<IconCurrencyReal size={16} />}
                    min={0}
                    decimalScale={2}
                    thousandSeparator="."
                    decimalSeparator=","
                  />
                </Grid.Col>
              </Grid>
              
              <Divider my="md" />
              
              <Stack gap="sm">
                <Checkbox
                  label="Incluir estatísticas"
                  checked={filters.includeStatistics}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeStatistics: e.target.checked }))}
                />
                <Checkbox
                  label="Incluir gráficos (apenas PDF)"
                  checked={filters.includeCharts}
                  onChange={(e) => setFilters(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  disabled={exportType !== 'pdf'}
                />
              </Stack>
            </Paper>
          )}

          {/* Resumo da exportação */}
          <Paper p="md" withBorder bg="gray.0">
            <Text fw={500} mb="sm">Resumo da Exportação</Text>
            <Group gap="md">
              <Badge color="blue" variant="light">
                {imoveis.length} imóveis
              </Badge>
              <Badge color="green" variant="light">
                {exportType?.toUpperCase() || 'N/A'}
              </Badge>
              <Badge color="orange" variant="light">
                {reportTypes.find(r => r.value === reportType)?.label || 'N/A'}
              </Badge>
            </Group>
          </Paper>

          {/* Botões de ação */}
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close} disabled={exporting}>
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              loading={exporting}
              leftSection={<IconDownload size={16} />}
              disabled={!exportType || !reportType}
            >
              {exporting ? 'Exportando...' : 'Exportar'}
            </Button>
          </Group>

          {/* Progresso da exportação */}
          {exporting && (
            <Stack gap="sm">
              <Text size="sm" c="dimmed">
                Exportando relatório...
              </Text>
              <Progress value={exportProgress} animated />
            </Stack>
          )}
        </Stack>
      </Modal>
    </>
  );
}