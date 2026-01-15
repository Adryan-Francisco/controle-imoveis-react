import { useState, useCallback, useEffect } from 'react';
import { companiesAPI, boletosAPI } from '../utils/companiesAPI';
import { useNotifications } from './useNotifications';

/**
 * Hook para gerenciar empresas com integração ao Supabase
 * @param {string} userId - ID do usuário autenticado
 * @param {boolean} useLocalData - Se true, usa dados locais ao invés de API
 */
export const useCompaniesSupabase = (userId, useLocalData = false) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useNotifications();

  // Carregar empresas ao montar o componente
  useEffect(() => {
    if (!useLocalData && userId) {
      loadCompanies();
    }
  }, [userId, useLocalData]);

  const loadCompanies = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await companiesAPI.getCompanies(userId);

      if (error) throw error;

      // Transformar dados do Supabase para formato da aplicação
      const companiesWithBoletos = await Promise.all(
        (data || []).map(async (company) => {
          const { data: boletos } = await boletosAPI.getBoletosByCompany(company.id);
          return {
            id: company.id,
            name: company.name,
            cnpj: company.cnpj,
            regimeType: company.type === 'MEI' ? 'mei' : 'simples_nacional',
            monthlyFee: parseFloat(company.boleto_amount || 0),
            dueDay: company.boleto_day || 5,
            responsibleName: company.contact_person,
            responsiblePhone: company.contact_phone,
            email: company.contact_email || company.email,
            createdAt: company.created_at,
            updatedAt: company.updated_at,
            boletos: (boletos || []).map((b) => ({
              id: b.id,
              amount: parseFloat(b.amount),
              barcode: b.boleto_number,
              dueDate: b.due_date,
              status: b.status === 'paid' ? 'pago' : 'pendente',
              createdAt: b.created_at,
              paidAt: b.payment_date,
            })),
            lastBoletoDate: boletos?.[0]?.created_at,
          };
        })
      );

      setCompanies(companiesWithBoletos);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
      setError(err.message);
      addNotification({
        title: 'Erro',
        message: 'Erro ao carregar empresas',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, addNotification]);

  // Adicionar empresa
  const addCompany = useCallback(
    async (companyData) => {
      if (!userId) return;

      setLoading(true);
      try {
        const { data, error } = await companiesAPI.createCompany(userId, companyData);

        if (error) throw error;

        const newCompany = {
          id: data.id,
          name: data.name,
          cnpj: data.cnpj,
          regimeType: data.type === 'MEI' ? 'mei' : 'simples_nacional',
          monthlyFee: parseFloat(data.boleto_amount || 0),
          dueDay: data.boleto_day || 5,
          responsibleName: data.contact_person,
          responsiblePhone: data.contact_phone,
          email: data.contact_email || data.email,
          createdAt: data.created_at,
          boletos: [],
        };

        setCompanies((prev) => [newCompany, ...prev]);
        addNotification({
          title: 'Sucesso',
          message: `${companyData.name} cadastrada com sucesso`,
          type: 'success',
        });

        return newCompany;
      } catch (err) {
        console.error('Erro ao adicionar empresa:', err);
        addNotification({
          title: 'Erro',
          message: 'Erro ao cadastrar empresa',
          type: 'error',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId, addNotification]
  );

  // Atualizar empresa
  const updateCompany = useCallback(
    async (id, companyData) => {
      setLoading(true);
      try {
        const { error } = await companiesAPI.updateCompany(id, companyData);

        if (error) throw error;

        setCompanies((prev) =>
          prev.map((company) =>
            company.id === id
              ? {
                  ...company,
                  name: companyData.name,
                  cnpj: companyData.cnpj,
                  regimeType: companyData.regimeType === 'mei' ? 'mei' : 'simples_nacional',
                  monthlyFee: parseFloat(companyData.monthlyFee),
                  dueDay: parseInt(companyData.dueDay),
                  responsibleName: companyData.responsibleName,
                  responsiblePhone: companyData.responsiblePhone,
                  email: companyData.email,
                  updatedAt: new Date().toISOString(),
                }
              : company
          )
        );

        addNotification({
          title: 'Sucesso',
          message: 'Empresa atualizada com sucesso',
          type: 'success',
        });
      } catch (err) {
        console.error('Erro ao atualizar empresa:', err);
        addNotification({
          title: 'Erro',
          message: 'Erro ao atualizar empresa',
          type: 'error',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addNotification]
  );

  // Deletar empresa
  const deleteCompany = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const { error } = await companiesAPI.deleteCompany(id);

        if (error) throw error;

        setCompanies((prev) => prev.filter((company) => company.id !== id));
        addNotification({
          title: 'Sucesso',
          message: 'Empresa deletada com sucesso',
          type: 'success',
        });
      } catch (err) {
        console.error('Erro ao deletar empresa:', err);
        addNotification({
          title: 'Erro',
          message: 'Erro ao deletar empresa',
          type: 'error',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addNotification]
  );

  // Gerar boleto
  const addBoleto = useCallback(
    async (companyId, boletoData) => {
      setLoading(true);
      try {
        const { data, error } = await boletosAPI.createBoleto(companyId, boletoData);

        if (error) throw error;

        const newBoleto = {
          id: data.id,
          amount: parseFloat(data.amount),
          barcode: data.boleto_number,
          dueDate: data.due_date,
          status: 'pendente',
          createdAt: data.created_at,
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
      } catch (err) {
        console.error('Erro ao gerar boleto:', err);
        addNotification({
          title: 'Erro',
          message: 'Erro ao gerar boleto',
          type: 'error',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addNotification]
  );

  // Marcar boleto como pago
  const markBoletoAsPaid = useCallback(
    async (companyId, boletoId) => {
      setLoading(true);
      try {
        const { error } = await boletosAPI.markBoletoAsPaid(boletoId);

        if (error) throw error;

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
      } catch (err) {
        console.error('Erro ao marcar boleto como pago:', err);
        addNotification({
          title: 'Erro',
          message: 'Erro ao marcar boleto como pago',
          type: 'error',
        });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addNotification]
  );

  // Recarregar dados
  const refresh = useCallback(() => {
    if (!useLocalData && userId) {
      loadCompanies();
    }
  }, [userId, useLocalData, loadCompanies]);

  return {
    companies,
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany,
    addBoleto,
    markBoletoAsPaid,
    refresh,
  };
};
