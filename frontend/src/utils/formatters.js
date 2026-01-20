/**
 * Utilitários centralizados de formatação
 * Evita duplicação de código e mantém consistência na aplicação
 */

/**
 * Formata CNPJ: XX.XXX.XXX/XXXX-XX
 */
export const formatCNPJ = (cnpj) => {
  if (!cnpj) return '';
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

/**
 * Remove formatação de CNPJ
 */
export const unformatCNPJ = (cnpj) => {
  return cnpj?.replace(/\D/g, '') || '';
};

/**
 * Formata moeda em BRL
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata data em formato brasileiro (DD/MM/YYYY)
 */
export const formatDate = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return date;
  }
};

/**
 * Formata data com hora
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return date;
  }
};

/**
 * Formata telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Remove formatação de telefone
 */
export const unformatPhone = (phone) => {
  return phone?.replace(/\D/g, '') || '';
};

/**
 * Formata percentual
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0%';
  return `${parseFloat(value).toFixed(decimals)}%`;
};

/**
 * Trunca texto com ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Converte status para rótulo amigável
 */
export const statusToLabel = (status) => {
  const labels = {
    pago: 'Pago',
    pendente: 'Pendente',
    vencido: 'Vencido',
    cancelado: 'Cancelado',
    simples_nacional: 'Simples Nacional',
    lucro_presumido: 'Lucro Presumido',
    lucro_real: 'Lucro Real',
    mei: 'MEI',
  };
  return labels[status] || capitalize(status);
};
