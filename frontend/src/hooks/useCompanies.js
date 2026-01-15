import { useState, useCallback } from 'react';
import { useNotifications } from './useNotifications';

// Dados de exemplo iniciais
const INITIAL_COMPANIES = [
  {
    id: 1,
    name: 'Imóveis Brasil Ltda',
    cnpj: '12.345.678/0001-90',
    regimeType: 'simples_nacional',
    monthlyFee: 500.00,
    dueDay: 5,
    responsibleName: 'João Silva',
    responsiblePhone: '(11) 98765-4321',
    email: 'joao@imoveis.com.br',
    createdAt: new Date().toISOString(),
    boletos: [
      {
        id: 101,
        amount: 500.00,
        barcode: '1234567890123456789012345',
        dueDate: '2025-01-05',
        status: 'pago',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 102,
        amount: 500.00,
        barcode: '2345678901234567890123456',
        dueDate: '2025-02-05',
        status: 'pendente',
        createdAt: new Date().toISOString(),
      },
    ],
    lastBoletoDate: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'MEI Consultoria',
    cnpj: '98.765.432/0001-12',
    regimeType: 'mei',
    monthlyFee: 300.00,
    dueDay: 10,
    responsibleName: 'Maria Santos',
    responsiblePhone: '(21) 99876-5432',
    email: 'maria@meiconsultoria.com.br',
    createdAt: new Date().toISOString(),
    boletos: [],
  },
];

export const useCompanies = (useInitialData = false) => {
  const [companies, setCompanies] = useState(() => 
    useInitialData ? INITIAL_COMPANIES : []
  );
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  // Adicionar empresa
  const addCompany = useCallback((companyData) => {
    try {
      const newCompany = {
        id: Date.now(),
        ...companyData,
        createdAt: new Date().toISOString(),
        boletos: [],
      };
      setCompanies((prev) => [newCompany, ...prev]);
      addNotification({
        title: 'Sucesso',
        message: `${companyData.name} cadastrada com sucesso`,
        type: 'success',
      });
      return newCompany;
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Erro ao cadastrar empresa',
        type: 'error',
      });
      throw error;
    }
  }, [addNotification]);

  // Atualizar empresa
  const updateCompany = useCallback((id, companyData) => {
    try {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === id
            ? { ...company, ...companyData, updatedAt: new Date().toISOString() }
            : company
        )
      );
      addNotification({
        title: 'Sucesso',
        message: 'Empresa atualizada com sucesso',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Erro ao atualizar empresa',
        type: 'error',
      });
      throw error;
    }
  }, [addNotification]);

  // Deletar empresa
  const deleteCompany = useCallback((id) => {
    try {
      setCompanies((prev) => prev.filter((company) => company.id !== id));
      addNotification({
        title: 'Sucesso',
        message: 'Empresa deletada com sucesso',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Erro ao deletar empresa',
        type: 'error',
      });
      throw error;
    }
  }, [addNotification]);

  // Gerar boleto
  const addBoleto = useCallback((companyId, boletoData) => {
    try {
      const newBoleto = {
        id: Date.now(),
        ...boletoData,
        status: 'pendente',
        createdAt: new Date().toISOString(),
      };

      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId
            ? {
                ...company,
                boletos: [...(company.boletos || []), newBoleto],
                lastBoletoDate: new Date().toISOString(),
              }
            : company
        )
      );

      addNotification({
        title: 'Sucesso',
        message: 'Boleto gerado com sucesso',
        type: 'success',
      });

      return newBoleto;
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Erro ao gerar boleto',
        type: 'error',
      });
      throw error;
    }
  }, [addNotification]);

  // Marcar boleto como pago
  const markBoletoAsPaid = useCallback((companyId, boletoId) => {
    try {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId
            ? {
                ...company,
                boletos: (company.boletos || []).map((boleto) =>
                  boleto.id === boletoId
                    ? { ...boleto, status: 'pago', paidAt: new Date().toISOString() }
                    : boleto
                ),
              }
            : company
        )
      );

      addNotification({
        title: 'Sucesso',
        message: 'Boleto marcado como pago',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Erro ao marcar boleto como pago',
        type: 'error',
      });
      throw error;
    }
  }, [addNotification]);

  return {
    companies,
    loading,
    addCompany,
    updateCompany,
    deleteCompany,
    addBoleto,
    markBoletoAsPaid,
  };
};
