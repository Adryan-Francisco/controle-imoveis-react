import { supabase } from '../supabaseClient';

/**
 * API para gerenciar Empresas
 */
export const companiesAPI = {
  /**
   * Listar todas as empresas do usuário
   */
  async getCompanies(userId) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
      return { data: null, error };
    }
  },

  /**
   * Obter uma empresa específica
   */
  async getCompanyById(id) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar empresa:', error);
      return { data: null, error };
    }
  },

  /**
   * Criar nova empresa
   */
  async createCompany(userId, companyData) {
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
            phone: companyData.responsiblePhone,
            contact_person: companyData.responsibleName,
            contact_email: companyData.email,
            contact_phone: companyData.responsiblePhone,
            boleto_day: parseInt(companyData.dueDay),
            boleto_amount: parseFloat(companyData.monthlyFee),
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      return { data: null, error };
    }
  },

  /**
   * Atualizar empresa
   */
  async updateCompany(id, companyData) {
    try {
      const updatePayload = {
        name: companyData.name,
        cnpj: companyData.cnpj,
        type: companyData.regimeType === 'mei' ? 'MEI' : 'SIMPLES_NACIONAL',
        email: companyData.email,
        phone: companyData.responsiblePhone,
        contact_person: companyData.responsibleName,
        contact_email: companyData.email,
        contact_phone: companyData.responsiblePhone,
        boleto_day: parseInt(companyData.dueDay),
        boleto_amount: parseFloat(companyData.monthlyFee),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('companies')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      return { data: null, error };
    }
  },

  /**
   * Deletar empresa (soft delete)
   */
  async deleteCompany(id) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao deletar empresa:', error);
      return { data: null, error };
    }
  },
};

/**
 * API para gerenciar Boletos de Empresas
 */
export const boletosAPI = {
  /**
   * Listar boletos de uma empresa
   */
  async getBoletosByCompany(companyId) {
    try {
      const { data, error } = await supabase
        .from('company_boletos')
        .select('*')
        .eq('company_id', companyId)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao buscar boletos:', error);
      return { data: null, error };
    }
  },

  /**
   * Criar novo boleto
   */
  async createBoleto(companyId, boletoData) {
    try {
      // Gerar número de boleto simulado
      const boletoNumber = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

      const { data, error } = await supabase
        .from('company_boletos')
        .insert([
          {
            company_id: companyId,
            boleto_number: boletoNumber,
            amount: parseFloat(boletoData.amount),
            due_date: boletoData.dueDate,
            issue_date: new Date().toISOString().split('T')[0],
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar boleto:', error);
      return { data: null, error };
    }
  },

  /**
   * Marcar boleto como pago
   */
  async markBoletoAsPaid(boletoId) {
    try {
      const { data, error } = await supabase
        .from('company_boletos')
        .update({
          status: 'paid',
          payment_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', boletoId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao marcar boleto como pago:', error);
      return { data: null, error };
    }
  },

  /**
   * Marcar boleto como enviado
   */
  async markBoletoAsSent(boletoId, sentToEmail) {
    try {
      const { data, error } = await supabase
        .from('company_boletos')
        .update({
          status: 'sent',
          sent_date: new Date().toISOString(),
          sent_to_email: sentToEmail,
          updated_at: new Date().toISOString(),
        })
        .eq('id', boletoId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao marcar boleto como enviado:', error);
      return { data: null, error };
    }
  },

  /**
   * Cancelar boleto
   */
  async cancelBoleto(boletoId, notes = '') {
    try {
      const { data, error } = await supabase
        .from('company_boletos')
        .update({
          status: 'cancelled',
          notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', boletoId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao cancelar boleto:', error);
      return { data: null, error };
    }
  },

  /**
   * Atualizar boleto
   */
  async updateBoleto(boletoId, boletoData) {
    try {
      const { data, error } = await supabase
        .from('company_boletos')
        .update({
          ...boletoData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', boletoId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar boleto:', error);
      return { data: null, error };
    }
  },
};

/**
 * API para gerenciar Agendamentos de Boletos
 */
export const scheduleAPI = {
  /**
   * Obter agendamento de boletos de uma empresa
   */
  async getSchedule(companyId) {
    try {
      const { data, error } = await supabase
        .from('boleto_schedules')
        .select('*')
        .eq('company_id', companyId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return { data: error?.code === 'PGRST116' ? null : data, error: null };
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      return { data: null, error };
    }
  },

  /**
   * Criar agendamento de boletos
   */
  async createSchedule(companyId, scheduleData) {
    try {
      const { data, error } = await supabase
        .from('boleto_schedules')
        .insert([
          {
            company_id: companyId,
            schedule_day: parseInt(scheduleData.scheduleDay),
            schedule_time: scheduleData.scheduleTime || '08:00:00',
            is_active: scheduleData.isActive !== false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      return { data: null, error };
    }
  },

  /**
   * Atualizar agendamento
   */
  async updateSchedule(scheduleId, scheduleData) {
    try {
      const { data, error } = await supabase
        .from('boleto_schedules')
        .update({
          schedule_day: parseInt(scheduleData.scheduleDay),
          schedule_time: scheduleData.scheduleTime,
          is_active: scheduleData.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', scheduleId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      return { data: null, error };
    }
  },

  /**
   * Deletar agendamento
   */
  async deleteSchedule(scheduleId) {
    try {
      const { error } = await supabase
        .from('boleto_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      return { data: null, error };
    }
  },
};
