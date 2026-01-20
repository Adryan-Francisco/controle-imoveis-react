import { useState, useCallback } from 'react';
import { useNotifications } from './useNotifications';
import { INITIAL_COMPANIES, createCompany, createBoleto } from '../utils/companyFactory';
import { logger } from '../utils/logger';

export const useCompanies = (useInitialData = false) => {
  const [companies, setCompanies] = useState(() => 
    useInitialData ? INITIAL_COMPANIES : []
  );
  const [loading] = useState(false);
  const { addNotification } = useNotifications();

  // Adicionar empresa
  const addCompany = useCallback((companyData) => {
    try {
      if (!companyData.name || !companyData.cnpj) {
        throw new Error('Nome e CNPJ são obrigatórios');
      }

      const newCompany = createCompany({
        ...companyData,
        monthlyFees: companyData.monthlyFees || {},
      });

      setCompanies((prev) => [newCompany, ...prev]);
      logger.info(`Empresa criada: ${companyData.name}`, { id: newCompany.id });

      addNotification({
        title: 'Sucesso',
        message: `${companyData.name} cadastrada com sucesso`,
        type: 'success',
      });
      return newCompany;
    } catch (error) {
      logger.error(`Erro ao cadastrar empresa: ${error.message}`, error);
      addNotification({
        title: 'Erro',
        message: error.message || 'Erro ao cadastrar empresa',
        type: 'error',
      });
      throw error;
    }
  }, [addNotification]);

  // Atualizar empresa
  const updateCompany = useCallback((id, companyData) => {
    try {
      if (!id) {
        throw new Error('ID da empresa é obrigatório');
      }

      setCompanies((prev) =>
        prev.map((company) =>
          company.id === id
            ? { ...company, ...companyData, updatedAt: new Date().toISOString() }
            : company
        )
      );

      logger.info(`Empresa atualizada: ${id}`, { data: companyData });

      addNotification({
        title: 'Sucesso',
        message: 'Empresa atualizada com sucesso',
        type: 'success',
      });
    } catch (error) {
      logger.error(`Erro ao atualizar empresa ${id}: ${error.message}`, error);
      addNotification({
        title: 'Erro',
        message: error.message || 'Erro ao atualizar empresa',
        type: 'error',
      });
      throw error;
    }
  }, [addNotification]);

  // Deletar empresa
  const deleteCompany = useCallback((id) => {
    try {
      if (!id) {
        throw new Error('ID da empresa é obrigatório');
      }

      const company = companies.find((c) => c.id === id);
      
      setCompanies((prev) => prev.filter((company) => company.id !== id));
      
      logger.info(`Empresa deletada: ${id} - ${company?.name}`);

      addNotification({
        title: 'Sucesso',
        message: 'Empresa deletada com sucesso',
        type: 'success',
      });
    } catch (error) {
      logger.error(`Erro ao deletar empresa ${id}: ${error.message}`, error);
      addNotification({
        title: 'Erro',
        message: error.message || 'Erro ao deletar empresa',
        type: 'error',
      });
      throw error;
    }
  }, [companies, addNotification]);

  // Gerar boleto
  const addBoleto = useCallback((companyId, boletoData) => {
    try {
      if (!companyId || !boletoData.amount || !boletoData.barcode) {
        throw new Error('ID da empresa, valor e código de barras são obrigatórios');
      }

      const newBoleto = createBoleto(companyId, boletoData);

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

      logger.info(`Boleto criado para empresa ${companyId}`, { 
        boletoId: newBoleto.id, 
        amount: boletoData.amount 
      });

      addNotification({
        title: 'Sucesso',
        message: 'Boleto gerado com sucesso',
        type: 'success',
      });

      return newBoleto;
    } catch (error) {
      logger.error(`Erro ao gerar boleto: ${error.message}`, error);
      addNotification({
        title: 'Erro',
        message: error.message || 'Erro ao gerar boleto',
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

  // Adicionar mensalidade
  const addMonthlyFee = useCallback((companyId, feeData) => {
    try {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId
            ? {
                ...company,
                monthlyFees: {
                  ...(company.monthlyFees || {}),
                  [feeData.month]: {
                    month: feeData.month,
                    year: feeData.year,
                    amount: feeData.amount,
                    dueDate: feeData.dueDate,
                    status: 'pendente',
                    createdAt: new Date().toISOString(),
                  },
                },
              }
            : company
        )
      );

      addNotification({
        title: 'Sucesso',
        message: 'Mensalidade adicionada com sucesso',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Erro ao adicionar mensalidade',
        type: 'error',
      });
      throw error;
    }
  }, [addNotification]);

  // Marcar mensalidade como paga
  const markMonthlyFeeAsPaid = useCallback((companyId, month) => {
    try {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === companyId
            ? {
                ...company,
                monthlyFees: {
                  ...(company.monthlyFees || {}),
                  [month]: {
                    ...((company.monthlyFees || {})[month] || {}),
                    status: 'pago',
                    paidAt: new Date().toISOString(),
                  },
                },
              }
            : company
        )
      );

      addNotification({
        title: 'Sucesso',
        message: 'Mensalidade marcada como paga',
        type: 'success',
      });
    } catch (error) {
      addNotification({
        title: 'Erro',
        message: 'Erro ao marcar mensalidade como paga',
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
    addMonthlyFee,
    markMonthlyFeeAsPaid,
  };
};
