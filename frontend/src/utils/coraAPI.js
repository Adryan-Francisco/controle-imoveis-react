/**
 * Integração com API do Banco Cora
 * Documentação: https://api.cora.com.br/docs
 */

// Configurações do Cora (adicione ao .env)
const CORA_API_URL = import.meta.env.VITE_CORA_API_URL || 'https://api.cora.com.br';
const CORA_TOKEN = import.meta.env.VITE_CORA_TOKEN;
const CORA_ACCOUNT_ID = import.meta.env.VITE_CORA_ACCOUNT_ID;

/**
 * Cliente para API do Cora
 */
export const coraAPI = {
  /**
   * Gerar boleto através do Cora
   * @param {Object} boletoData - Dados do boleto
   * @returns {Promise} Resposta com dados do boleto gerado
   */
  async generateBoleto(boletoData) {
    try {
      if (!CORA_TOKEN) {
        throw new Error('Token do Cora não configurado. Verifique VITE_CORA_TOKEN em .env');
      }

      const payload = {
        // Informações do boleto
        amount: parseFloat(boletoData.amount) * 100, // Converter para centavos
        dueDate: boletoData.dueDate, // YYYY-MM-DD
        
        // Informações do beneficiário (empresa)
        beneficiary: {
          name: boletoData.beneficiaryName,
          cnpj: boletoData.cnpj,
          email: boletoData.beneficiaryEmail,
        },

        // Informações do pagador (cliente)
        payer: {
          name: boletoData.payerName,
          cpfCnpj: boletoData.payerCnpj || boletoData.cpf,
          email: boletoData.payerEmail,
          address: boletoData.payerAddress,
        },

        // Descrição
        description: boletoData.description || 'Mensalidade',
        
        // Instrução de pagamento
        instructions: boletoData.instructions || 'Boleto para pagamento de mensalidade',
      };

      const response = await fetch(`${CORA_API_URL}/v1/boletos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CORA_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 
          `Erro ao gerar boleto: ${response.status} - ${response.statusText}`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: {
          id: result.id,
          boletoNumber: result.boletoNumber || result.nossoNumero,
          barcode: result.barcode || result.codigoBarras,
          pdfUrl: result.pdfUrl,
          dueDate: result.dueDate,
          amount: result.amount / 100, // Converter de centavos para reais
          status: result.status || 'issued',
          createdAt: new Date().toISOString(),
        },
        error: null,
      };
    } catch (error) {
      console.error('Erro ao gerar boleto no Cora:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Listar boletos gerados
   */
  async listBoletos(filters = {}) {
    try {
      if (!CORA_TOKEN) {
        throw new Error('Token do Cora não configurado');
      }

      let url = `${CORA_API_URL}/v1/boletos`;
      const params = new URLSearchParams();

      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CORA_TOKEN}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar boletos: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: (result.data || result).map((boleto) => ({
          id: boleto.id,
          boletoNumber: boleto.boletoNumber || boleto.nossoNumero,
          barcode: boleto.barcode || boleto.codigoBarras,
          amount: boleto.amount / 100,
          dueDate: boleto.dueDate,
          status: boleto.status,
          pdfUrl: boleto.pdfUrl,
          createdAt: boleto.createdAt,
        })),
        error: null,
      };
    } catch (error) {
      console.error('Erro ao listar boletos:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Obter detalhes de um boleto
   */
  async getBoleto(boletoId) {
    try {
      if (!CORA_TOKEN) {
        throw new Error('Token do Cora não configurado');
      }

      const response = await fetch(`${CORA_API_URL}/v1/boletos/${boletoId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CORA_TOKEN}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter boleto: ${response.statusText}`);
      }

      const boleto = await response.json();

      return {
        success: true,
        data: {
          id: boleto.id,
          boletoNumber: boleto.boletoNumber || boleto.nossoNumero,
          barcode: boleto.barcode || boleto.codigoBarras,
          amount: boleto.amount / 100,
          dueDate: boleto.dueDate,
          status: boleto.status,
          pdfUrl: boleto.pdfUrl,
          paidDate: boleto.paidDate,
          createdAt: boleto.createdAt,
        },
        error: null,
      };
    } catch (error) {
      console.error('Erro ao obter boleto:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Cancelar boleto
   */
  async cancelBoleto(boletoId) {
    try {
      if (!CORA_TOKEN) {
        throw new Error('Token do Cora não configurado');
      }

      const response = await fetch(`${CORA_API_URL}/v1/boletos/${boletoId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CORA_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao cancelar boleto: ${response.statusText}`);
      }

      return {
        success: true,
        data: null,
        error: null,
      };
    } catch (error) {
      console.error('Erro ao cancelar boleto:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Obter PDF do boleto para download
   */
  async getBoletoPDF(boletoId) {
    try {
      if (!CORA_TOKEN) {
        throw new Error('Token do Cora não configurado');
      }

      const response = await fetch(`${CORA_API_URL}/v1/boletos/${boletoId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CORA_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao obter PDF: ${response.statusText}`);
      }

      return response.blob();
    } catch (error) {
      console.error('Erro ao obter PDF do boleto:', error);
      throw error;
    }
  },

  /**
   * Registrar webhook para notificações de pagamento
   */
  async registerWebhook(webhookUrl, events = ['boleto.paid', 'boleto.overdue']) {
    try {
      if (!CORA_TOKEN) {
        throw new Error('Token do Cora não configurado');
      }

      const response = await fetch(`${CORA_API_URL}/v1/webhooks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CORA_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          events: events,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao registrar webhook: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
        error: null,
      };
    } catch (error) {
      console.error('Erro ao registrar webhook:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }
  },

  /**
   * Validar dados do boleto antes de enviar
   */
  validateBoletoData(data) {
    const errors = [];

    if (!data.beneficiaryName) errors.push('Nome do beneficiário é obrigatório');
    if (!data.cnpj || data.cnpj.replace(/\D/g, '').length !== 14) {
      errors.push('CNPJ inválido');
    }
    if (!data.amount || data.amount <= 0) errors.push('Valor deve ser maior que 0');
    if (!data.dueDate) errors.push('Data de vencimento é obrigatória');
    if (!data.payerName) errors.push('Nome do pagador é obrigatório');
    if (!data.payerEmail || !this._isValidEmail(data.payerEmail)) {
      errors.push('Email do pagador inválido');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validar email
   */
  _isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },
};

/**
 * Webhook handler para processar eventos do Cora
 * Use em seu backend/API route
 */
export function handleCoraWebhook(event) {
  const { type, data } = event;

  switch (type) {
    case 'boleto.paid':
      console.log('Boleto pago:', data);
      // Atualizar status do boleto no banco de dados
      return {
        status: 'paid',
        paidDate: data.paidDate,
      };

    case 'boleto.overdue':
      console.log('Boleto vencido:', data);
      // Atualizar status do boleto no banco de dados
      return {
        status: 'overdue',
      };

    case 'boleto.issued':
      console.log('Boleto emitido:', data);
      return {
        status: 'issued',
      };

    default:
      console.warn('Evento desconhecido:', type);
      return null;
  }
}

export default coraAPI;
