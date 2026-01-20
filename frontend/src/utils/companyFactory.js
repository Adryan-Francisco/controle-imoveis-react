/**
 * Factory para criar dados iniciais e estruturas padrão de empresas
 * Centraliza a lógica de criação de dados consistentes
 */

export const createCompany = (overrides = {}) => {
  const defaults = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    monthlyFees: {},
    boletos: [],
    updatedAt: new Date().toISOString(),
  };

  return { ...defaults, ...overrides };
};

export const createBoleto = (companyId, overrides = {}) => {
  return {
    id: Date.now(),
    companyId,
    status: 'pendente',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

export const createMonthlyFee = (month, year, amount, dueDay, overrides = {}) => {
  const dueDate = new Date(year, parseInt(month) - 1, dueDay);
  const dueDateString = dueDate.toISOString().split('T')[0];

  return {
    month,
    year,
    amount,
    dueDate: dueDateString,
    status: 'pendente',
    ...overrides,
  };
};

/**
 * Dados de exemplo para desenvolvimento
 * Fácil de manter centralizado
 */
export const INITIAL_COMPANIES = [
  createCompany({
    id: 1,
    name: 'Imóveis Brasil Ltda',
    cnpj: '12.345.678/0001-90',
    regimeType: 'simples_nacional',
    monthlyFee: 500.00,
    dueDay: 5,
    responsibleName: 'João Silva',
    responsiblePhone: '(11) 98765-4321',
    email: 'joao@imoveis.com.br',
    monthlyFees: {
      '01': createMonthlyFee('01', 2025, 500.00, 5, { status: 'pago', paidAt: new Date().toISOString() }),
      '02': createMonthlyFee('02', 2025, 500.00, 5),
    },
    boletos: [
      createBoleto(1, {
        id: 101,
        amount: 500.00,
        barcode: '1234567890123456789012345',
        dueDate: '2025-01-05',
        status: 'pago',
        paidAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      }),
      createBoleto(1, {
        id: 102,
        amount: 500.00,
        barcode: '2345678901234567890123456',
        dueDate: '2025-02-05',
        status: 'pendente',
      }),
    ],
  }),
  createCompany({
    id: 2,
    name: 'MEI Consultoria',
    cnpj: '98.765.432/0001-12',
    regimeType: 'mei',
    monthlyFee: 300.00,
    dueDay: 10,
    responsibleName: 'Maria Santos',
    responsiblePhone: '(21) 99876-5432',
    email: 'maria@meiconsultoria.com.br',
  }),
];
