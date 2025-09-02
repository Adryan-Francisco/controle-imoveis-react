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
  useMantineTheme,
  Grid,
  NumberInput,
  TextInput,
  Divider
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
  IconAlertCircle
} from '@tabler/icons-react';

export function ReportsExport({ imoveis, statistics, isMobile = false }) {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportType, setExportType] = useState('pdf');
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });

  // Opções de exportação
  const exportOptions = [
    { value: 'pdf', label: 'PDF', icon: IconFileText },
    { value: 'excel', label: 'Excel', icon: IconTable },
    { value: 'csv', label: 'CSV', icon: IconTable }
  ];

  // Tipos de relatório
  const reportTypes = [
    { value: 'summary', label: 'Resumo Executivo' },
    { value: 'detailed', label: 'Relatório Detalhado' },
    { value: 'financial', label: 'Relatório Financeiro' },
    { value: 'custom', label: 'Relatório Personalizado' }
  ];

  // Gerar dados do relatório
  const generateReportData = () => {
    const filteredImoveis = imoveis.filter(imovel => {
      if (dateRange.start && imovel.data_vencimento && new Date(imovel.data_vencimento) < dateRange.start) return false;
      if (dateRange.end && imovel.data_vencimento && new Date(imovel.data_vencimento) > dateRange.end) return false;
      return true;
    });

    const reportData = {
      summary: {
        totalImoveis: filteredImoveis.length,
        totalValue: filteredImoveis.reduce((sum, imovel) => sum + (imovel.valor || 0), 0),
        paidCount: filteredImoveis.filter(i => i.status_pagamento === 'PAGO').length,
        pendingCount: filteredImoveis.filter(i => i.status_pagamento === 'PENDENTE').length,
        overdueCount: filteredImoveis.filter(i => i.status_pagamento === 'ATRASADO').length,
        paymentRate: filteredImoveis.length > 0 ? 
          (filteredImoveis.filter(i => i.status_pagamento === 'PAGO').length / filteredImoveis.length * 100).toFixed(1) : 0
      },
      details: filteredImoveis,
      statistics: statistics,
      generatedAt: new Date().toLocaleString('pt-BR'),
      dateRange: dateRange,
      reportType: reportType // Adicionar tipo de relatório
    };

    return reportData;
  };

  // Exportar para PDF
  const exportToPDF = async (data) => {
    // Simular geração de PDF
    for (let i = 0; i <= 100; i += 10) {
      setExportProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Criar conteúdo HTML para conversão em PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Imóveis Rurais</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          h1 { color: #2563eb; text-align: center; margin-bottom: 30px; }
          h2 { color: #1e40af; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
          .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .summary-item { margin: 8px 0; font-size: 14px; }
          .details { margin: 20px 0; }
          .imovel { background: #ffffff; border: 1px solid #e2e8f0; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .imovel h3 { color: #1e40af; margin-top: 0; margin-bottom: 15px; font-size: 18px; }
          .imovel p { margin: 8px 0; font-size: 14px; }
          .imovel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .status-pago { color: #059669; font-weight: bold; }
          .status-pendente { color: #d97706; font-weight: bold; }
          .status-atrasado { color: #dc2626; font-weight: bold; }
          @media print { body { margin: 10px; } .imovel { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>RELATÓRIO DE IMÓVEIS RURAIS</h1>
        <p><strong>Gerado em:</strong> ${data.generatedAt}</p>
        
        <div class="summary">
          <h2>RESUMO EXECUTIVO</h2>
          <div class="summary-item"><strong>Total de Imóveis:</strong> ${data.summary.totalImoveis}</div>
          <div class="summary-item"><strong>Valor Total:</strong> R$ ${data.summary.totalValue.toLocaleString('pt-BR')}</div>
          <div class="summary-item"><strong>Imóveis Pagos:</strong> ${data.summary.paidCount}</div>
          <div class="summary-item"><strong>Imóveis Pendentes:</strong> ${data.summary.pendingCount}</div>
          <div class="summary-item"><strong>Imóveis Atrasados:</strong> ${data.summary.overdueCount}</div>
          <div class="summary-item"><strong>Taxa de Pagamento:</strong> ${data.summary.paymentRate}%</div>
        </div>
        
        <div class="details">
          <h2>DADOS CADASTRAIS DOS PROPRIETÁRIOS</h2>
          ${data.details.map((imovel, index) => `
            <div class="imovel">
              <h3>${index + 1}. ${imovel.proprietario || 'N/A'}</h3>
              <div class="imovel-grid">
                <div>
                  <p><strong>CPF:</strong> ${imovel.cpf || 'N/A'}</p>
                  <p><strong>Telefone:</strong> ${imovel.telefone || 'N/A'}</p>
                  <p><strong>Sítio/Fazenda:</strong> ${imovel.sitio || 'N/A'}</p>
                  <p><strong>Endereço:</strong> ${imovel.endereco || 'N/A'}</p>
                  <p><strong>Localização:</strong> ${imovel.localizacao || 'N/A'}</p>
                </div>
                <div>
                  <p><strong>CCIR:</strong> ${imovel.ccir || 'N/A'}</p>
                  <p><strong>ITR:</strong> ${imovel.itr || 'N/A'}</p>
                  <p><strong>Valor:</strong> R$ ${(imovel.valor || 0).toLocaleString('pt-BR')}</p>
                  <p><strong>Status:</strong> <span class="status-${(imovel.status_pagamento || '').toLowerCase()}">${imovel.status_pagamento || 'N/A'}</span></p>
                  <p><strong>Data Vencimento:</strong> ${imovel.data_vencimento ? new Date(imovel.data_vencimento).toLocaleDateString('pt-BR') : 'N/A'}</p>
                  <p><strong>Data Pagamento:</strong> ${imovel.data_pagamento ? new Date(imovel.data_pagamento).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </div>
              <p><strong>Observações:</strong> ${imovel.observacoes || 'N/A'}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    // Criar e baixar arquivo HTML (que pode ser convertido para PDF pelo navegador)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-imoveis-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Exportar para Excel/CSV
  const exportToExcel = async (data) => {
    for (let i = 0; i <= 100; i += 15) {
      setExportProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Criar CSV
    const headers = ['Proprietário', 'CPF', 'Telefone', 'Sítio/Fazenda', 'Endereço', 'Localização', 'CCIR', 'ITR', 'Valor', 'Status', 'Data Vencimento', 'Data Pagamento', 'Observações'];
    const csvContent = [
      headers.join(','),
      ...data.details.map(imovel => [
        `"${imovel.proprietario || 'N/A'}"`,
        `"${imovel.cpf || 'N/A'}"`,
        `"${imovel.telefone || 'N/A'}"`,
        `"${imovel.sitio || 'N/A'}"`,
        `"${imovel.endereco || 'N/A'}"`,
        `"${imovel.localizacao || 'N/A'}"`,
        `"${imovel.ccir || 'N/A'}"`,
        `"${imovel.itr || 'N/A'}"`,
        imovel.valor || 0,
        `"${imovel.status_pagamento || 'N/A'}"`,
        imovel.data_vencimento ? new Date(imovel.data_vencimento).toLocaleDateString('pt-BR') : 'N/A',
        imovel.data_pagamento ? new Date(imovel.data_pagamento).toLocaleDateString('pt-BR') : 'N/A',
        `"${imovel.observacoes || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imoveis-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Executar exportação
  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);

    try {
      const reportData = generateReportData();

      if (exportType === 'pdf') {
        await exportToPDF(reportData);
      } else {
        await exportToExcel(reportData);
      }

      // Sucesso
      setTimeout(() => {
        setExporting(false);
        setExportProgress(0);
        close();
      }, 1000);

    } catch (error) {
      console.error('Erro na exportação:', error);
      setExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <>
      <Paper shadow="sm" p="md" radius="md" mb="md">
        <Group justify="space-between">
          <Group>
            <IconChartBar size={24} color={theme.colors.blue[6]} />
            <Text size="lg" fw={600}>Relatórios e Exportação</Text>
          </Group>
          
          <Group gap="sm">
            <Button
              leftSection={<IconFileExport size={16} />}
              onClick={open}
              variant="light"
              size={isMobile ? 'sm' : 'md'}
            >
              {isMobile ? 'Exportar' : 'Gerar Relatório'}
            </Button>
          </Group>
        </Group>
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group>
            <IconFileExport size={20} />
            <Text>Gerar Relatório</Text>
          </Group>
        }
        size={isMobile ? 'sm' : 'md'}
      >
        <Stack gap="md">
          {exporting ? (
            <Stack gap="md">
              <Alert
                icon={<IconCheck size={16} />}
                title="Exportando..."
                color="blue"
              >
                Gerando seu relatório, aguarde...
              </Alert>
              
              <Progress 
                value={exportProgress} 
                size="lg" 
                radius="md"
                striped
                animated
              />
              
              <Text size="sm" ta="center" c="dimmed">
                {exportProgress}% concluído
              </Text>
            </Stack>
          ) : (
            <>
              <Grid>
                <Grid.Col span={isMobile ? 12 : 6}>
                  <Select
                    label="Tipo de Exportação"
                    placeholder="Selecione o formato"
                    data={exportOptions.map(opt => ({
                      value: opt.value,
                      label: opt.label
                    }))}
                    value={exportType}
                    onChange={setExportType}
                    leftSection={<IconDownload size={16} />}
                  />
                </Grid.Col>
                
                <Grid.Col span={isMobile ? 12 : 6}>
                  <Select
                    label="Tipo de Relatório"
                    placeholder="Selecione o tipo"
                    data={reportTypes}
                    value={reportType}
                    onChange={setReportType}
                    leftSection={<IconChartBar size={16} />}
                  />
                </Grid.Col>
                
                <Grid.Col span={isMobile ? 12 : 6}>
                  <DatePickerInput
                    label="Data Início"
                    placeholder="Selecione a data"
                    value={dateRange.start}
                    onChange={(value) => setDateRange(prev => ({ ...prev, start: value }))}
                    leftSection={<IconCalendar size={16} />}
                  />
                </Grid.Col>
                
                <Grid.Col span={isMobile ? 12 : 6}>
                  <DatePickerInput
                    label="Data Fim"
                    placeholder="Selecione a data"
                    value={dateRange.end}
                    onChange={(value) => setDateRange(prev => ({ ...prev, end: value }))}
                    leftSection={<IconCalendar size={16} />}
                  />
                </Grid.Col>
              </Grid>

              <Divider />

              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  {imoveis.length} imóveis disponíveis
                </Text>
                
                <Group gap="sm">
                  <Button
                    variant="outline"
                    onClick={close}
                    size="sm"
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    onClick={handleExport}
                    leftSection={<IconDownload size={16} />}
                    size="sm"
                  >
                    Exportar
                  </Button>
                </Group>
              </Group>
            </>
          )}
        </Stack>
      </Modal>
    </>
  );
}
