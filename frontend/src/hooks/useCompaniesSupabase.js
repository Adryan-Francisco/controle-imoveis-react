import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';
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
  const notificationHook = useNotifications();
  const addNotification = notificationHook?.addNotification || (() => {});

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
      // Buscar empresas do usuário
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null);

      if (companiesError) throw companiesError;

      // Buscar boletos para cada empresa
      const companiesWithBoletos = await Promise.all(
        (companiesData || []).map(async (company) => {
          const { data: boletos } = await supabase
            .from('company_boletos')
            .select('*')
            .eq('company_id', company.id)
            .order('due_date', { ascending: false });

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
            address: company.address,
            city: company.city,
            state: company.state,
            zipCode: company.zip_code,
            isActive: company.is_active,
            createdAt: company.created_at,
            updatedAt: company.updated_at,
            monthlyFees: {},
            boletos: (boletos || []).map((b) => ({
              id: b.id,
              amount: parseFloat(b.amount),
              barcode: b.boleto_number,
              dueDate: b.due_date,
              status: b.status === 'paid' ? 'pago' : 'pendente',
              createdAt: b.created_at,
              paidAt: b.payment_date,
              issueDate: b.issue_date,
              notes: b.notes,
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
  }, [userId]);

  // Adicionar empresa
  const addCompany = useCallback(
    async (companyData) => {
      if (!userId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .insert([
            {
              user_id: userId,
              name: companyData.name,
              cnpj: companyData.cnpj,
              type: companyData.regimeType === 'mei' ? 'MEI' : 'SIMPLES_NACIONAL',
              email: companyData.email,
              phone: companyData.phone,
              address: companyData.address,
              city: companyData.city,
              state: companyData.state,
              zip_code: companyData.zipCode,
              contact_person: companyData.responsibleName,
              contact_email: companyData.responsibleEmail,
              contact_phone: companyData.responsiblePhone,
              boleto_day: companyData.dueDay || 5,
              boleto_amount: companyData.monthlyFee || 0,
              is_active: true,
              notes: companyData.notes,
            },
          ])
          .select();

        if (error) throw error;

        const newCompany = {
          id: data[0].id,
          name: data[0].name,
          cnpj: data[0].cnpj,
          regimeType: data[0].type === 'MEI' ? 'mei' : 'simples_nacional',
          monthlyFee: parseFloat(data[0].boleto_amount || 0),
          dueDay: data[0].boleto_day || 5,
          responsibleName: data[0].contact_person,
          responsiblePhone: data[0].contact_phone,
          email: data[0].contact_email || data[0].email,
          createdAt: data[0].created_at,
          boletos: [],
          monthlyFees: {},
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
    [userId]
  );

  // Atualizar empresa
  const updateCompany = useCallback(
    async (companyId, companyData) => {
      if (!userId) return;

      setLoading(true);
      try {
        const { error } = await supabase
          .from('companies')
          .update({
            name: companyData.name,
            cnpj: companyData.cnpj,
            type: companyData.regimeType === 'mei' ? 'MEI' : 'SIMPLES_NACIONAL',
            email: companyData.email,
            phone: companyData.phone,
            address: companyData.address,
            city: companyData.city,
            state: companyData.state,
            zip_code: companyData.zipCode,
            contact_person: companyData.responsibleName,
            contact_email: companyData.responsibleEmail,
            contact_phone: companyData.responsiblePhone,
            boleto_day: companyData.dueDay || 5,
            boleto_amount: companyData.monthlyFee || 0,
            notes: companyData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', companyId)
          .eq('user_id', userId);

        if (error) throw error;

        setCompanies((prev) =>
          prev.map((company) =>
            company.id === companyId
              ? {
                  ...company,
                  name: companyData.name,
                  cnpj: companyData.cnpj,
                  regimeType: companyData.regimeType,
                  monthlyFee: companyData.monthlyFee,
                  dueDay: companyData.dueDay,
                  responsibleName: companyData.responsibleName,
                  responsiblePhone: companyData.responsiblePhone,
                  email: companyData.email,
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
    [userId]
  );

  // Deletar empresa
  const deleteCompany = useCallback(
    async (companyId) => {
      if (!userId) return;

      setLoading(true);
      try {
        const { error } = await supabase
          .from('companies')
          .update({
            deleted_at: new Date().toISOString(),
          })
          .eq('id', companyId)
          .eq('user_id', userId);

        if (error) throw error;

        setCompanies((prev) => prev.filter((c) => c.id !== companyId));

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
    [userId]
  );

  // Adicionar boleto
  const addBoleto = useCallback(
    async (companyId, boletoData) => {
      if (!userId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('company_boletos')
          .insert([
            {
              company_id: companyId,
              amount: boletoData.amount,
              due_date: boletoData.dueDate,
              issue_date: boletoData.issueDate || new Date().toISOString().split('T')[0],
              status: 'pending',
              notes: boletoData.notes,
            },
          ])
          .select();

        if (error) throw error;

        const newBoleto = {
          id: data[0].id,
          amount: parseFloat(data[0].amount),
          barcode: data[0].boleto_number,
          dueDate: data[0].due_date,
          status: 'pendente',
          createdAt: data[0].created_at,
          issueDate: data[0].issue_date,
          notes: data[0].notes,
        };

        setCompanies((prev) =>
          prev.map((c) =>
            c.id === companyId
              ? {
                  ...c,
                  boletos: [newBoleto, ...c.boletos],
                  lastBoletoDate: new Date().toISOString(),
                }
              : c
          )
        );

        addNotification({
          title: 'Sucesso',
          message: 'Boleto gerado com sucesso',
          type: 'success',
        });

        return newBoleto;
      } catch (err) {
        console.error('Erro ao adicionar boleto:', err);
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
    [userId]
  );

  // Marcar boleto como pago
  const markBoletoAsPaid = useCallback(
    async (companyId, boletoId) => {
      if (!userId) return;

      setLoading(true);
      try {
        const { error } = await supabase
          .from('company_boletos')
          .update({
            status: 'paid',
            payment_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', boletoId);

        if (error) throw error;

        setCompanies((prev) =>
          prev.map((c) =>
            c.id === companyId
              ? {
                  ...c,
                  boletos: c.boletos.map((b) =>
                    b.id === boletoId
                      ? { ...b, status: 'pago', paidAt: new Date().toISOString() }
                      : b
                  ),
                }
              : c
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
    [userId]
  );

  const refresh = useCallback(() => {
    loadCompanies();
  }, [loadCompanies]);

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
