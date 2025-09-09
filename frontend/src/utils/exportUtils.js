// src/utils/exportUtils.js
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Configurações de exportação
const EXPORT_CONFIG = {
  pdf: {
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    margin: 20
  },
  excel: {
    sheetName: 'Imóveis Rurais'
  }
};

// Formatar dados para exportação
export function formatDataForExport(data, type = 'all') {
  return data.map(item => ({
    'ID': item.id,
    'Proprietário': item.proprietario || '',
    'Sítio/Fazenda': item.sitio || '',
    'CPF': item.cpf || '',
    'Telefone': item.telefone || '',
    'Endereço': item.endereco || '',
    'CCIR': item.ccir || '',
    'ITR': item.itr || '',
    'Valor': item.valor ? `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
    'Status': getStatusLabel(item.status_pagamento),
    'Data Vencimento': item.data_vencimento ? new Date(item.data_vencimento).toLocaleDateString('pt-BR') : '',
    'Data Pagamento': item.data_pagamento ? new Date(item.data_pagamento).toLocaleDateString('pt-BR') : ''
  }));
}

// Obter label do status
function getStatusLabel(status) {
  const statusMap = {
    'PAGO': 'Pago',
    'PENDENTE': 'Pendente',
    'ATRASADO': 'Atrasado'
  };
  return statusMap[status] || status;
}

// Exportar para PDF
export function exportToPDF(data, filename = 'imoveis-rurais.pdf', title = 'Relatório de Imóveis Rurais') {
  try {
    const doc = new jsPDF(EXPORT_CONFIG.pdf);
    
    // Título
    doc.setFontSize(20);
    doc.text(title, EXPORT_CONFIG.pdf.margin, 20);
    
    // Data de geração
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, EXPORT_CONFIG.pdf.margin, 30);
    
    // Tabela
    const tableData = formatDataForExport(data);
    const columns = Object.keys(tableData[0] || {});
    
    // Usar tabela manual (mais confiável)
    createManualTable(doc, tableData, columns);
    
    // Salvar arquivo
    doc.save(filename);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw new Error('Erro ao gerar PDF: ' + error.message);
  }
}

// Exportar para Excel
export function exportToExcel(data, filename = 'imoveis-rurais.xlsx', sheetName = 'Imóveis Rurais') {
  const worksheet = XLSX.utils.json_to_sheet(formatDataForExport(data));
  const workbook = XLSX.utils.book_new();
  
  // Adicionar planilha
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Adicionar planilha de estatísticas
  const statsData = calculateStatistics(data);
  const statsWorksheet = XLSX.utils.json_to_sheet([statsData]);
  XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Estatísticas');
  
  // Salvar arquivo
  XLSX.writeFile(workbook, filename);
}

// Exportar para CSV
export function exportToCSV(data, filename = 'imoveis-rurais.csv') {
  const csvData = formatDataForExport(data);
  const csvContent = convertToCSV(csvData);
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

// Exportar para HTML
export function exportToHTML(data, filename = 'imoveis-rurais.html', title = 'Relatório de Imóveis Rurais') {
  const htmlContent = generateHTMLReport(data, title);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  saveAs(blob, filename);
}

// Converter dados para CSV
function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Cabeçalho
  csvRows.push(headers.join(','));
  
  // Dados
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Escapar aspas e vírgulas
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

// Calcular estatísticas para exportação
function calculateStatistics(data) {
  const total = data.length;
  const pagos = data.filter(item => item.status_pagamento === 'PAGO').length;
  const pendentes = data.filter(item => item.status_pagamento === 'PENDENTE').length;
  const atrasados = data.filter(item => item.status_pagamento === 'ATRASADO').length;
  
  const valorTotal = data.reduce((sum, item) => sum + (item.valor || 0), 0);
  const valorPendente = data
    .filter(item => item.status_pagamento === 'PENDENTE' || item.status_pagamento === 'ATRASADO')
    .reduce((sum, item) => sum + (item.valor || 0), 0);
  
  const taxaPagamento = total > 0 ? (pagos / total) * 100 : 0;
  
  return {
    'Total de Imóveis': total,
    'Imóveis Pagos': pagos,
    'Imóveis Pendentes': pendentes,
    'Imóveis Atrasados': atrasados,
    'Valor Total': `R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    'Valor Pendente': `R$ ${valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    'Taxa de Pagamento': `${taxaPagamento.toFixed(1)}%`
  };
}

// Exportar relatório personalizado
export function exportCustomReport(data, options = {}) {
  const {
    format = 'pdf',
    title = 'Relatório Personalizado',
    filename = 'relatorio-personalizado',
    filters = {},
    includeStatistics = true
  } = options;
  
  // Aplicar filtros se fornecidos
  let filteredData = data;
  if (Object.keys(filters).length > 0) {
    filteredData = applyFilters(data, filters);
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const finalFilename = `${filename}-${timestamp}.${format}`;
  
  switch (format.toLowerCase()) {
    case 'pdf':
      exportToPDF(filteredData, finalFilename, title);
      break;
    case 'excel':
    case 'xlsx':
      exportToExcel(filteredData, finalFilename, title);
      break;
    case 'csv':
      exportToCSV(filteredData, finalFilename);
      break;
    case 'html':
      exportToHTML(filteredData, finalFilename, title);
      break;
    default:
      throw new Error(`Formato não suportado: ${format}`);
  }
}

// Aplicar filtros aos dados
function applyFilters(data, filters) {
  return data.filter(item => {
    // Implementar lógica de filtros aqui
    // Por enquanto, retorna todos os dados
    return true;
  });
}

// Gerar nome de arquivo com timestamp
export function generateFilename(prefix = 'export', extension = 'pdf') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  return `${prefix}-${timestamp}.${extension}`;
}

// Gerar relatório HTML completo
function generateHTMLReport(data, title) {
  const statistics = calculateStatistics(data);
  const currentDate = new Date().toLocaleString('pt-BR');
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-5px);
        }
        
        .stat-card h3 {
            color: #667eea;
            font-size: 2rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .stat-card p {
            color: #666;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .table-container {
            padding: 30px;
            overflow-x: auto;
        }
        
        .table-title {
            font-size: 1.8rem;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        td {
            padding: 15px 12px;
            border-bottom: 1px solid #eee;
            font-size: 0.9rem;
        }
        
        tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        tr:hover {
            background: #e3f2fd;
            transition: background 0.3s ease;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .status-pago {
            background: #d4edda;
            color: #155724;
        }
        
        .status-pendente {
            background: #fff3cd;
            color: #856404;
        }
        
        .status-atrasado {
            background: #f8d7da;
            color: #721c24;
        }
        
        .footer {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 0.9rem;
        }
        
        .currency {
            font-weight: 600;
            color: #28a745;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
                padding: 20px;
            }
            
            .table-container {
                padding: 20px;
            }
            
            table {
                font-size: 0.8rem;
            }
            
            th, td {
                padding: 10px 8px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <p>Relatório gerado em ${currentDate}</p>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>${statistics['Total de Imóveis']}</h3>
                <p>Total de Imóveis</p>
            </div>
            <div class="stat-card">
                <h3>${statistics['Imóveis Pagos']}</h3>
                <p>Imóveis Pagos</p>
            </div>
            <div class="stat-card">
                <h3>${statistics['Imóveis Pendentes']}</h3>
                <p>Imóveis Pendentes</p>
            </div>
            <div class="stat-card">
                <h3>${statistics['Imóveis Atrasados']}</h3>
                <p>Imóveis Atrasados</p>
            </div>
            <div class="stat-card">
                <h3 class="currency">${statistics['Valor Total']}</h3>
                <p>Valor Total</p>
            </div>
            <div class="stat-card">
                <h3 class="currency">${statistics['Valor Pendente']}</h3>
                <p>Valor Pendente</p>
            </div>
            <div class="stat-card">
                <h3>${statistics['Taxa de Pagamento']}</h3>
                <p>Taxa de Pagamento</p>
            </div>
        </div>
        
        <div class="table-container">
            <h2 class="table-title">Lista Detalhada de Imóveis</h2>
            ${data.length === 0 ? 
                '<div class="no-data">Nenhum dado encontrado para exibir.</div>' :
                generateTableHTML(data)
            }
        </div>
        
        <div class="footer">
            <p>Relatório gerado automaticamente pelo Sistema de Controle de Imóveis Rurais</p>
            <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
    </div>
</body>
</html>`;
}

// Gerar HTML da tabela
function generateTableHTML(data) {
  const tableData = formatDataForExport(data);
  const columns = Object.keys(tableData[0] || {});
  
  let tableHTML = `
    <table>
        <thead>
            <tr>
                ${columns.map(col => `<th>${col}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
  `;
  
  tableData.forEach(row => {
    tableHTML += '<tr>';
    columns.forEach(col => {
      let cellContent = row[col] || '';
      
      // Formatação especial para status
      if (col === 'Status') {
        const statusClass = getStatusClass(cellContent);
        cellContent = `<span class="status-badge status-${statusClass}">${cellContent}</span>`;
      }
      
      // Formatação especial para valores monetários
      if (col === 'Valor' && cellContent.includes('R$')) {
        cellContent = `<span class="currency">${cellContent}</span>`;
      }
      
      tableHTML += `<td>${cellContent}</td>`;
    });
    tableHTML += '</tr>';
  });
  
  tableHTML += `
        </tbody>
    </table>
  `;
  
  return tableHTML;
}

// Obter classe CSS para status
function getStatusClass(status) {
  const statusMap = {
    'Pago': 'pago',
    'Pendente': 'pendente',
    'Atrasado': 'atrasado'
  };
  return statusMap[status] || 'pendente';
}

// Função de fallback para criar tabela manualmente
function createManualTable(doc, tableData, columns) {
  const startY = 40;
  const rowHeight = 8;
  const colWidth = (doc.internal.pageSize.width - (EXPORT_CONFIG.pdf.margin * 2)) / columns.length;
  
  let currentY = startY;
  
  // Cabeçalho
  doc.setFillColor(41, 128, 185);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  
  columns.forEach((col, index) => {
    const x = EXPORT_CONFIG.pdf.margin + (index * colWidth);
    doc.rect(x, currentY, colWidth, rowHeight, 'F');
    doc.text(col, x + 2, currentY + 5);
  });
  
  currentY += rowHeight;
  
  // Dados
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  
  tableData.forEach((row, rowIndex) => {
    if (currentY + rowHeight > doc.internal.pageSize.height - 20) {
      doc.addPage();
      currentY = 20;
    }
    
    // Alternar cor de fundo
    if (rowIndex % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      columns.forEach((_, index) => {
        const x = EXPORT_CONFIG.pdf.margin + (index * colWidth);
        doc.rect(x, currentY, colWidth, rowHeight, 'F');
      });
    }
    
    columns.forEach((col, index) => {
      const x = EXPORT_CONFIG.pdf.margin + (index * colWidth);
      const value = String(row[col] || '');
      doc.text(value, x + 2, currentY + 5);
    });
    
    currentY += rowHeight;
  });
}

